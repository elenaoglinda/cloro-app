CREATE POLICY "super admins read all orgs"
  ON public.organizations FOR SELECT TO authenticated
  USING (public.has_platform_role(auth.uid(), 'super_admin'));

CREATE POLICY "super admins update all orgs"
  ON public.organizations FOR UPDATE TO authenticated
  USING (public.has_platform_role(auth.uid(), 'super_admin'))
  WITH CHECK (public.has_platform_role(auth.uid(), 'super_admin'));

CREATE POLICY "super admins read all org members"
  ON public.org_members FOR SELECT TO authenticated
  USING (public.has_platform_role(auth.uid(), 'super_admin'));

CREATE POLICY "super admins read all profiles"
  ON public.profiles FOR SELECT TO authenticated
  USING (public.has_platform_role(auth.uid(), 'super_admin'));