import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

export const getMyContext = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabase, userId } = context;
    const { data: profile } = await supabase
      .from("profiles")
      .select("id, full_name, avatar_url, default_org_id")
      .eq("id", userId)
      .maybeSingle();

    const { data: memberships } = await supabase
      .from("org_members")
      .select("role, org_id, organizations(id, name, slug, plan)")
      .eq("user_id", userId);

    const orgs = (memberships ?? []).map((m: any) => ({
      ...m.organizations,
      role: m.role,
    }));

    const currentOrgId =
      profile?.default_org_id ?? orgs[0]?.id ?? null;
    const currentOrg = orgs.find((o) => o.id === currentOrgId) ?? null;

    return { profile, orgs, currentOrg };
  });
