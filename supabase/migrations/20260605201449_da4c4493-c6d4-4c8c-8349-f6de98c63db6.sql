
-- INVITES
CREATE TABLE public.org_invites (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id uuid NOT NULL,
  email text NOT NULL,
  role org_role NOT NULL DEFAULT 'tecnico',
  token uuid NOT NULL DEFAULT gen_random_uuid(),
  invited_by uuid NOT NULL,
  accepted_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  expires_at timestamptz NOT NULL DEFAULT (now() + interval '14 days'),
  UNIQUE(org_id, email)
);
CREATE INDEX idx_org_invites_token ON public.org_invites(token);
CREATE INDEX idx_org_invites_email ON public.org_invites(lower(email));
GRANT SELECT, INSERT, UPDATE, DELETE ON public.org_invites TO authenticated;
GRANT ALL ON public.org_invites TO service_role;
ALTER TABLE public.org_invites ENABLE ROW LEVEL SECURITY;
CREATE POLICY "members read org invites" ON public.org_invites FOR SELECT TO authenticated USING (is_org_member(org_id));
CREATE POLICY "admins manage invites" ON public.org_invites FOR ALL TO authenticated
  USING (has_org_role(org_id, ARRAY['owner'::org_role,'admin'::org_role]))
  WITH CHECK (has_org_role(org_id, ARRAY['owner'::org_role,'admin'::org_role]));
CREATE POLICY "invitee reads own invite by email" ON public.org_invites FOR SELECT TO authenticated
  USING (lower(email) = lower((SELECT email FROM auth.users WHERE id = auth.uid())));

-- RUTAS
CREATE TABLE public.rutas (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id uuid NOT NULL,
  nombre text NOT NULL,
  fecha date NOT NULL,
  tecnico_id uuid,
  notas text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX idx_rutas_org_fecha ON public.rutas(org_id, fecha);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.rutas TO authenticated;
GRANT ALL ON public.rutas TO service_role;
ALTER TABLE public.rutas ENABLE ROW LEVEL SECURITY;
CREATE POLICY "org members read rutas" ON public.rutas FOR SELECT TO authenticated USING (is_org_member(org_id));
CREATE POLICY "org members write rutas" ON public.rutas FOR ALL TO authenticated
  USING (is_org_member(org_id)) WITH CHECK (is_org_member(org_id));
CREATE TRIGGER set_rutas_updated BEFORE UPDATE ON public.rutas FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TABLE public.ruta_paradas (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id uuid NOT NULL,
  ruta_id uuid NOT NULL REFERENCES public.rutas(id) ON DELETE CASCADE,
  piscina_id uuid NOT NULL,
  orden int NOT NULL DEFAULT 0,
  completada boolean NOT NULL DEFAULT false,
  parte_id uuid,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX idx_paradas_ruta ON public.ruta_paradas(ruta_id, orden);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.ruta_paradas TO authenticated;
GRANT ALL ON public.ruta_paradas TO service_role;
ALTER TABLE public.ruta_paradas ENABLE ROW LEVEL SECURITY;
CREATE POLICY "org members read paradas" ON public.ruta_paradas FOR SELECT TO authenticated USING (is_org_member(org_id));
CREATE POLICY "org members write paradas" ON public.ruta_paradas FOR ALL TO authenticated
  USING (is_org_member(org_id)) WITH CHECK (is_org_member(org_id));

-- STORAGE policies for parte-fotos. Path convention: {org_id}/{parte_id}/{filename}
CREATE POLICY "org members read parte-fotos" ON storage.objects FOR SELECT TO authenticated
  USING (bucket_id = 'parte-fotos' AND is_org_member((storage.foldername(name))[1]::uuid));
CREATE POLICY "org members upload parte-fotos" ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'parte-fotos' AND is_org_member((storage.foldername(name))[1]::uuid));
CREATE POLICY "org members update parte-fotos" ON storage.objects FOR UPDATE TO authenticated
  USING (bucket_id = 'parte-fotos' AND is_org_member((storage.foldername(name))[1]::uuid));
CREATE POLICY "org members delete parte-fotos" ON storage.objects FOR DELETE TO authenticated
  USING (bucket_id = 'parte-fotos' AND is_org_member((storage.foldername(name))[1]::uuid));
