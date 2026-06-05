import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

const emailSchema = z.string().trim().toLowerCase().email().max(255);

export const listInvites = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabase, userId } = context;
    const { data: prof } = await supabase
      .from("profiles").select("default_org_id").eq("id", userId).maybeSingle();
    if (!prof?.default_org_id) return { invites: [], members: [] };
    const [{ data: invites }, { data: members }] = await Promise.all([
      supabase.from("org_invites")
        .select("id, email, role, accepted_at, expires_at, created_at, token")
        .eq("org_id", prof.default_org_id)
        .order("created_at", { ascending: false }),
      supabase.from("org_members")
        .select("user_id, role, created_at")
        .eq("org_id", prof.default_org_id),
    ]);
    return { invites: invites ?? [], members: members ?? [] };
  });

export const createInvite = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) =>
    z.object({
      email: emailSchema,
      role: z.enum(["admin", "tecnico"]).default("tecnico"),
    }).parse(d),
  )
  .handler(async ({ context, data }) => {
    const { supabase, userId } = context;
    const { data: prof } = await supabase
      .from("profiles").select("default_org_id").eq("id", userId).maybeSingle();
    if (!prof?.default_org_id) throw new Error("Sin organización");
    const { data: row, error } = await supabase
      .from("org_invites")
      .upsert(
        { org_id: prof.default_org_id, email: data.email, role: data.role, invited_by: userId },
        { onConflict: "org_id,email" },
      )
      .select("id, token")
      .single();
    if (error) throw new Error(error.message);
    return { id: row.id, token: row.token };
  });

export const revokeInvite = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => z.object({ id: z.string().uuid() }).parse(d))
  .handler(async ({ context, data }) => {
    const { error } = await context.supabase.from("org_invites").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const acceptInvite = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => z.object({ token: z.string().uuid() }).parse(d))
  .handler(async ({ context, data }) => {
    const { supabase, userId } = context;
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    const { data: invite } = await supabaseAdmin
      .from("org_invites")
      .select("id, org_id, role, email, accepted_at, expires_at")
      .eq("token", data.token)
      .maybeSingle();
    if (!invite) throw new Error("Invitación no encontrada");
    if (invite.accepted_at) throw new Error("Ya aceptada");
    if (new Date(invite.expires_at) < new Date()) throw new Error("Invitación caducada");

    const { data: user } = await supabaseAdmin.auth.admin.getUserById(userId);
    const userEmail = user?.user?.email?.toLowerCase();
    if (!userEmail || userEmail !== invite.email.toLowerCase()) {
      throw new Error("Esta invitación es para otra cuenta");
    }

    await supabaseAdmin.from("org_members").upsert(
      { org_id: invite.org_id, user_id: userId, role: invite.role },
      { onConflict: "org_id,user_id" },
    );
    await supabaseAdmin.from("org_invites").update({ accepted_at: new Date().toISOString() }).eq("id", invite.id);
    await supabase.from("profiles").update({ default_org_id: invite.org_id }).eq("id", userId);

    return { org_id: invite.org_id };
  });
