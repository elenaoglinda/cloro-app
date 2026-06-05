-- ============================================================
-- Cloro app: orgs, members, profiles, clientes, piscinas, partes
-- ============================================================

-- Enums
CREATE TYPE public.org_role AS ENUM ('owner','admin','tecnico');
CREATE TYPE public.parte_estado AS ENUM ('borrador','completado','firmado');

-- updated_at trigger fn
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql SET search_path = public AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END $$;

-- =========== organizations ===========
CREATE TABLE public.organizations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text NOT NULL UNIQUE,
  plan text NOT NULL DEFAULT 'free',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.organizations TO authenticated;
GRANT ALL ON public.organizations TO service_role;
ALTER TABLE public.organizations ENABLE ROW LEVEL SECURITY;
CREATE TRIGGER trg_organizations_updated_at BEFORE UPDATE ON public.organizations
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- =========== profiles ===========
CREATE TABLE public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name text,
  avatar_url text,
  default_org_id uuid REFERENCES public.organizations(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE TRIGGER trg_profiles_updated_at BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- =========== org_members ===========
CREATE TABLE public.org_members (
  org_id uuid NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.org_role NOT NULL DEFAULT 'tecnico',
  created_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (org_id, user_id)
);
CREATE INDEX idx_org_members_user ON public.org_members(user_id);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.org_members TO authenticated;
GRANT ALL ON public.org_members TO service_role;
ALTER TABLE public.org_members ENABLE ROW LEVEL SECURITY;

-- =========== membership helpers (SECURITY DEFINER, avoid RLS recursion) ===========
CREATE OR REPLACE FUNCTION public.is_org_member(_org_id uuid)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS(SELECT 1 FROM public.org_members WHERE org_id=_org_id AND user_id=auth.uid())
$$;

CREATE OR REPLACE FUNCTION public.has_org_role(_org_id uuid, _roles public.org_role[])
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS(SELECT 1 FROM public.org_members
    WHERE org_id=_org_id AND user_id=auth.uid() AND role = ANY(_roles))
$$;

CREATE OR REPLACE FUNCTION public.current_org_id()
RETURNS uuid LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT default_org_id FROM public.profiles WHERE id = auth.uid()
$$;

-- =========== RLS: organizations ===========
CREATE POLICY "members read org" ON public.organizations FOR SELECT
  TO authenticated USING (public.is_org_member(id));
CREATE POLICY "owners update org" ON public.organizations FOR UPDATE
  TO authenticated USING (public.has_org_role(id, ARRAY['owner','admin']::public.org_role[]));
CREATE POLICY "any auth create org" ON public.organizations FOR INSERT
  TO authenticated WITH CHECK (true);

-- =========== RLS: profiles ===========
CREATE POLICY "self read profile" ON public.profiles FOR SELECT
  TO authenticated USING (id = auth.uid());
CREATE POLICY "self update profile" ON public.profiles FOR UPDATE
  TO authenticated USING (id = auth.uid());
CREATE POLICY "self insert profile" ON public.profiles FOR INSERT
  TO authenticated WITH CHECK (id = auth.uid());

-- =========== RLS: org_members ===========
CREATE POLICY "members read own org members" ON public.org_members FOR SELECT
  TO authenticated USING (public.is_org_member(org_id));
CREATE POLICY "owners manage members" ON public.org_members FOR ALL
  TO authenticated USING (public.has_org_role(org_id, ARRAY['owner','admin']::public.org_role[]))
  WITH CHECK (public.has_org_role(org_id, ARRAY['owner','admin']::public.org_role[]));

-- =========== clientes ===========
CREATE TABLE public.clientes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id uuid NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  nombre text NOT NULL,
  email text,
  telefono text,
  direccion text,
  notas text,
  archived boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX idx_clientes_org ON public.clientes(org_id) WHERE NOT archived;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.clientes TO authenticated;
GRANT ALL ON public.clientes TO service_role;
ALTER TABLE public.clientes ENABLE ROW LEVEL SECURITY;
CREATE TRIGGER trg_clientes_updated_at BEFORE UPDATE ON public.clientes
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE POLICY "org members read clientes" ON public.clientes FOR SELECT
  TO authenticated USING (public.is_org_member(org_id));
CREATE POLICY "org members write clientes" ON public.clientes FOR ALL
  TO authenticated USING (public.is_org_member(org_id))
  WITH CHECK (public.is_org_member(org_id));

-- =========== piscinas ===========
CREATE TABLE public.piscinas (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id uuid NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  cliente_id uuid NOT NULL REFERENCES public.clientes(id) ON DELETE CASCADE,
  alias text NOT NULL,
  tipo text,
  volumen_m3 numeric,
  sistema_desinfeccion text,
  direccion text,
  lat numeric,
  lng numeric,
  notas text,
  archived boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX idx_piscinas_org ON public.piscinas(org_id);
CREATE INDEX idx_piscinas_cliente ON public.piscinas(cliente_id);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.piscinas TO authenticated;
GRANT ALL ON public.piscinas TO service_role;
ALTER TABLE public.piscinas ENABLE ROW LEVEL SECURITY;
CREATE TRIGGER trg_piscinas_updated_at BEFORE UPDATE ON public.piscinas
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE POLICY "org members read piscinas" ON public.piscinas FOR SELECT
  TO authenticated USING (public.is_org_member(org_id));
CREATE POLICY "org members write piscinas" ON public.piscinas FOR ALL
  TO authenticated USING (public.is_org_member(org_id))
  WITH CHECK (public.is_org_member(org_id));

-- =========== partes ===========
CREATE TABLE public.partes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id uuid NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  piscina_id uuid NOT NULL REFERENCES public.piscinas(id) ON DELETE CASCADE,
  tecnico_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  fecha timestamptz NOT NULL DEFAULT now(),
  estado public.parte_estado NOT NULL DEFAULT 'borrador',
  ph numeric,
  cloro_libre numeric,
  cloro_total numeric,
  alcalinidad numeric,
  cya numeric,
  sal numeric,
  temp_c numeric,
  observaciones text,
  productos_usados jsonb NOT NULL DEFAULT '[]'::jsonb,
  firma_cliente_url text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX idx_partes_org_fecha ON public.partes(org_id, fecha DESC);
CREATE INDEX idx_partes_piscina ON public.partes(piscina_id, fecha DESC);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.partes TO authenticated;
GRANT ALL ON public.partes TO service_role;
ALTER TABLE public.partes ENABLE ROW LEVEL SECURITY;
CREATE TRIGGER trg_partes_updated_at BEFORE UPDATE ON public.partes
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE POLICY "org members read partes" ON public.partes FOR SELECT
  TO authenticated USING (public.is_org_member(org_id));
CREATE POLICY "org members write partes" ON public.partes FOR ALL
  TO authenticated USING (public.is_org_member(org_id))
  WITH CHECK (public.is_org_member(org_id));

-- =========== parte_fotos ===========
CREATE TABLE public.parte_fotos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id uuid NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  parte_id uuid NOT NULL REFERENCES public.partes(id) ON DELETE CASCADE,
  storage_path text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX idx_parte_fotos_parte ON public.parte_fotos(parte_id);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.parte_fotos TO authenticated;
GRANT ALL ON public.parte_fotos TO service_role;
ALTER TABLE public.parte_fotos ENABLE ROW LEVEL SECURITY;
CREATE POLICY "org members read fotos" ON public.parte_fotos FOR SELECT
  TO authenticated USING (public.is_org_member(org_id));
CREATE POLICY "org members write fotos" ON public.parte_fotos FOR ALL
  TO authenticated USING (public.is_org_member(org_id))
  WITH CHECK (public.is_org_member(org_id));

-- =========== auto-provision profile + personal org on signup ===========
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  new_org_id uuid;
  base_slug text;
  final_slug text;
  suffix int := 0;
BEGIN
  base_slug := regexp_replace(lower(coalesce(split_part(NEW.email,'@',1),'org')), '[^a-z0-9]+', '-', 'g');
  IF base_slug = '' OR base_slug IS NULL THEN base_slug := 'org'; END IF;
  final_slug := base_slug;
  WHILE EXISTS(SELECT 1 FROM public.organizations WHERE slug = final_slug) LOOP
    suffix := suffix + 1;
    final_slug := base_slug || '-' || suffix::text;
  END LOOP;

  INSERT INTO public.organizations(name, slug)
    VALUES (coalesce(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email,'@',1)) || ' — Equipo', final_slug)
    RETURNING id INTO new_org_id;

  INSERT INTO public.profiles(id, full_name, default_org_id)
    VALUES (NEW.id, NEW.raw_user_meta_data->>'full_name', new_org_id);

  INSERT INTO public.org_members(org_id, user_id, role)
    VALUES (new_org_id, NEW.id, 'owner');

  RETURN NEW;
END $$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- =========== realtime ===========
ALTER PUBLICATION supabase_realtime ADD TABLE public.partes;
