-- Platform-level roles (separate from org_members to avoid privilege escalation)
CREATE TYPE public.platform_role AS ENUM ('super_admin');

CREATE TABLE public.platform_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.platform_role NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);

GRANT SELECT ON public.platform_roles TO authenticated;
GRANT ALL ON public.platform_roles TO service_role;

ALTER TABLE public.platform_roles ENABLE ROW LEVEL SECURITY;

-- Security-definer check (avoids recursive RLS issues)
CREATE OR REPLACE FUNCTION public.has_platform_role(_user_id uuid, _role public.platform_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.platform_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

REVOKE EXECUTE ON FUNCTION public.has_platform_role(uuid, public.platform_role) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.has_platform_role(uuid, public.platform_role) TO authenticated;

-- A user can see their own platform role rows (so the UI can know "I'm super admin")
CREATE POLICY "users read own platform roles"
ON public.platform_roles FOR SELECT
TO authenticated
USING (user_id = auth.uid());

-- Only super admins can manage platform roles
CREATE POLICY "super admins manage platform roles"
ON public.platform_roles FOR ALL
TO authenticated
USING (public.has_platform_role(auth.uid(), 'super_admin'))
WITH CHECK (public.has_platform_role(auth.uid(), 'super_admin'));

-- Org suspension flag
ALTER TABLE public.organizations
  ADD COLUMN IF NOT EXISTS suspended boolean NOT NULL DEFAULT false;
