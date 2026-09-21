-- 1. Prepare plan values for the new enum
ALTER TABLE public.subscriptions ALTER COLUMN plan DROP DEFAULT;
UPDATE public.subscriptions
  SET plan = 'trial'
  WHERE plan IS NULL OR plan NOT IN ('trial','starter','pro','enterprise');

-- 2. Create plan enum idempotently
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'subscription_plan') THEN
    CREATE TYPE public.subscription_plan AS ENUM ('trial', 'starter', 'pro', 'enterprise');
  END IF;
END $$;

-- 3. Convert plan column to enum with a matching default
ALTER TABLE public.subscriptions
  ALTER COLUMN plan TYPE public.subscription_plan USING plan::public.subscription_plan,
  ALTER COLUMN plan SET DEFAULT 'trial'::public.subscription_plan;

-- 4. Rename foreign-key column and constraint
ALTER TABLE public.subscriptions
  RENAME COLUMN org_id TO organization_id;
ALTER TABLE public.subscriptions
  RENAME CONSTRAINT subscriptions_org_id_fkey TO subscriptions_organization_id_fkey;

-- 5. Add missing period-start column
ALTER TABLE public.subscriptions
  ADD COLUMN IF NOT EXISTS current_period_start TIMESTAMP WITH TIME ZONE;

-- 6. Keep access grants in place
GRANT SELECT ON public.subscriptions TO authenticated;
GRANT ALL ON public.subscriptions TO service_role;

-- 7. Refresh RLS policies to reference organization_id
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "members read own org subscription" ON public.subscriptions;
DROP POLICY IF EXISTS "Members can read own org subscription" ON public.subscriptions;
DROP POLICY IF EXISTS "super admins manage subscriptions" ON public.subscriptions;
DROP POLICY IF EXISTS "Super admins manage subscriptions" ON public.subscriptions;

CREATE POLICY "Members can read own org subscription"
  ON public.subscriptions
  FOR SELECT
  TO authenticated
  USING (public.is_org_member(organization_id));

CREATE POLICY "Super admins manage subscriptions"
  ON public.subscriptions
  FOR ALL
  TO authenticated
  USING (public.has_platform_role(auth.uid(), 'super_admin'::public.platform_role))
  WITH CHECK (public.has_platform_role(auth.uid(), 'super_admin'::public.platform_role));
