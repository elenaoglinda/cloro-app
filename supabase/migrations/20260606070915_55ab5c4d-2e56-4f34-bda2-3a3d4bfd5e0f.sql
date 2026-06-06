-- Lock down SECURITY DEFINER helper functions: only authenticated may execute
REVOKE EXECUTE ON FUNCTION public.has_org_role(uuid, org_role[]) FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.is_org_member(uuid) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.has_org_role(uuid, org_role[]) TO authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.is_org_member(uuid) TO authenticated, service_role;

-- Remove 'partes' from realtime publication: app does not subscribe to it,
-- and without realtime.messages RLS any authenticated user could subscribe
-- across organizations.
ALTER PUBLICATION supabase_realtime DROP TABLE public.partes;