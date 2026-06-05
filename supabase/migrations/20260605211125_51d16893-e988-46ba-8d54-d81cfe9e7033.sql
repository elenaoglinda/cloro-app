DROP POLICY IF EXISTS "invitee reads own invite by email" ON public.org_invites;

CREATE POLICY "invitee reads own invite by email"
  ON public.org_invites
  FOR SELECT
  TO authenticated
  USING (lower(email) = lower(coalesce((auth.jwt() ->> 'email')::text, '')));