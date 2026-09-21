import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

async function assertSuperAdmin(userId: string) {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const { data, error } = await supabaseAdmin
    .from("platform_roles")
    .select("id")
    .eq("user_id", userId)
    .eq("role", "super_admin")
    .maybeSingle();
  if (error) throw new Error(error.message);
  if (!data) throw new Error("No autorizado");
}

export const checkSuperAdmin = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data } = await supabaseAdmin
      .from("platform_roles")
      .select("id")
      .eq("user_id", context.userId)
      .eq("role", "super_admin")
      .maybeSingle();
    return { isSuperAdmin: !!data };
  });

export const bootstrapSuperAdmin = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) =>
    z.object({ password: z.string().min(1).max(200) }).parse(d),
  )
  .handler(async ({ context, data }) => {
    const expected = process.env.ADMIN_PASSWORD;
    if (!expected) throw new Error("ADMIN_PASSWORD no configurado");
    if (data.password !== expected) throw new Error("Contraseña incorrecta");
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin
      .from("platform_roles")
      .upsert(
        { user_id: context.userId, role: "super_admin" },
        { onConflict: "user_id,role" },
      );
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const listAllOrgs = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertSuperAdmin(context.userId);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    const { data: orgs, error } = await supabaseAdmin
      .from("organizations")
      .select(
        "id, name, slug, plan, suspended, created_at, subscription_status, trial_ends_at, notes",
      )
      .order("created_at", { ascending: false });
    if (error) throw new Error(error.message);

    const ids = (orgs ?? []).map((o) => o.id);
    if (ids.length === 0) return { orgs: [] };

    const [members, clientes, partes, owners] = await Promise.all([
      supabaseAdmin.from("org_members").select("org_id").in("org_id", ids),
      supabaseAdmin.from("clientes").select("org_id").in("org_id", ids).eq("archived", false),
      supabaseAdmin.from("partes").select("org_id, created_at").in("org_id", ids),
      supabaseAdmin
        .from("org_members")
        .select("org_id, user_id, created_at")
        .in("org_id", ids)
        .eq("role", "owner")
        .order("created_at", { ascending: true }),
    ]);

    const count = (rows: { org_id: string }[] | null) => {
      const map: Record<string, number> = {};
      (rows ?? []).forEach((r) => (map[r.org_id] = (map[r.org_id] ?? 0) + 1));
      return map;
    };
    const lastActivity: Record<string, string> = {};
    (partes.data ?? []).forEach((p: any) => {
      if (!lastActivity[p.org_id] || p.created_at > lastActivity[p.org_id]) {
        lastActivity[p.org_id] = p.created_at;
      }
    });

    const memberCounts = count(members.data as any);
    const clienteCounts = count(clientes.data as any);
    const parteCounts = count(partes.data as any);

    // First owner per org
    const ownerByOrg: Record<string, string> = {};
    (owners.data ?? []).forEach((m: any) => {
      if (!ownerByOrg[m.org_id]) ownerByOrg[m.org_id] = m.user_id;
    });
    const ownerIds = [...new Set(Object.values(ownerByOrg))];
    const ownerName: Record<string, string | null> = {};
    const ownerEmail: Record<string, string | null> = {};
    if (ownerIds.length) {
      const { data: profiles } = await supabaseAdmin
        .from("profiles")
        .select("id, full_name")
        .in("id", ownerIds);
      (profiles ?? []).forEach((p) => (ownerName[p.id] = p.full_name));
      await Promise.all(
        ownerIds.map(async (uid) => {
          try {
            const { data: u } = await supabaseAdmin.auth.admin.getUserById(uid);
            ownerEmail[uid] = u?.user?.email ?? null;
          } catch {
            ownerEmail[uid] = null;
          }
        }),
      );
    }

    return {
      orgs: (orgs ?? []).map((o) => {
        const uid = ownerByOrg[o.id];
        return {
          ...o,
          members: memberCounts[o.id] ?? 0,
          clientes: clienteCounts[o.id] ?? 0,
          partes: parteCounts[o.id] ?? 0,
          last_activity: lastActivity[o.id] ?? null,
          owner_name: uid ? (ownerName[uid] ?? null) : null,
          owner_email: uid ? (ownerEmail[uid] ?? null) : null,
        };
      }),
    };
  });


export const getOrgDetail = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => z.object({ id: z.string().uuid() }).parse(d))
  .handler(async ({ context, data }) => {
    await assertSuperAdmin(context.userId);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    const { data: org, error } = await supabaseAdmin
      .from("organizations")
      .select("id, name, slug, plan, suspended, created_at")
      .eq("id", data.id)
      .maybeSingle();
    if (error) throw new Error(error.message);
    if (!org) throw new Error("Organización no encontrada");

    const [{ data: members }, { data: clientes }, { data: partes }, { data: rutas }] =
      await Promise.all([
        supabaseAdmin
          .from("org_members")
          .select("user_id, role, created_at")
          .eq("org_id", data.id),
        supabaseAdmin
          .from("clientes")
          .select("id, nombre, email, telefono, archived, created_at")
          .eq("org_id", data.id)
          .order("created_at", { ascending: false })
          .limit(100),
        supabaseAdmin
          .from("partes")
          .select("id, created_at")
          .eq("org_id", data.id)
          .order("created_at", { ascending: false })
          .limit(100),
        supabaseAdmin
          .from("rutas")
          .select("id, nombre, created_at")
          .eq("org_id", data.id)
          .order("created_at", { ascending: false })
          .limit(50),
      ]);

    // Resolve member emails
    const userIds = (members ?? []).map((m) => m.user_id);
    const emails: Record<string, string> = {};
    if (userIds.length) {
      const { data: profiles } = await supabaseAdmin
        .from("profiles")
        .select("id, full_name")
        .in("id", userIds);
      const nameById: Record<string, string | null> = {};
      (profiles ?? []).forEach((p) => (nameById[p.id] = p.full_name));
      // Fetch auth emails via admin API
      for (const uid of userIds) {
        try {
          const { data: u } = await supabaseAdmin.auth.admin.getUserById(uid);
          emails[uid] = u?.user?.email ?? nameById[uid] ?? uid;
        } catch {
          emails[uid] = nameById[uid] ?? uid;
        }
      }
    }

    return {
      org,
      members: (members ?? []).map((m) => ({ ...m, email: emails[m.user_id] ?? m.user_id })),
      clientes: clientes ?? [],
      partes: partes ?? [],
      rutas: rutas ?? [],
    };
  });

export const updateOrgPlan = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) =>
    z
      .object({
        id: z.string().uuid(),
        plan: z.enum(["free", "starter", "pro", "enterprise"]),
      })
      .parse(d),
  )
  .handler(async ({ context, data }) => {
    await assertSuperAdmin(context.userId);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin
      .from("organizations")
      .update({ plan: data.plan })
      .eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const setOrgSuspended = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) =>
    z.object({ id: z.string().uuid(), suspended: z.boolean() }).parse(d),
  )
  .handler(async ({ context, data }) => {
    await assertSuperAdmin(context.userId);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin
      .from("organizations")
      .update({ suspended: data.suspended })
      .eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const inviteOrgOwner = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) =>
    z
      .object({
        orgId: z.string().uuid(),
        email: z.string().trim().toLowerCase().email().max(255),
        role: z.enum(["owner", "admin", "tecnico"]).default("admin"),
      })
      .parse(d),
  )
  .handler(async ({ context, data }) => {
    await assertSuperAdmin(context.userId);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: row, error } = await supabaseAdmin
      .from("org_invites")
      .upsert(
        {
          org_id: data.orgId,
          email: data.email,
          role: data.role,
          invited_by: context.userId,
        },
        { onConflict: "org_id,email" },
      )
      .select("id, token")
      .single();
    if (error) throw new Error(error.message);
    return { id: row.id, token: row.token };
  });

export const impersonateOrg = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => z.object({ orgId: z.string().uuid() }).parse(d))
  .handler(async ({ context, data }) => {
    await assertSuperAdmin(context.userId);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    // Add as owner-level member (idempotent)
    const { error: memErr } = await supabaseAdmin
      .from("org_members")
      .upsert(
        { org_id: data.orgId, user_id: context.userId, role: "owner" },
        { onConflict: "org_id,user_id" },
      );
    if (memErr) throw new Error(memErr.message);
    const { error: profErr } = await supabaseAdmin
      .from("profiles")
      .update({ default_org_id: data.orgId })
      .eq("id", context.userId);
    if (profErr) throw new Error(profErr.message);
    return { ok: true };
  });

export const stopImpersonating = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => z.object({ orgId: z.string().uuid() }).parse(d))
  .handler(async ({ context, data }) => {
    await assertSuperAdmin(context.userId);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    await supabaseAdmin
      .from("org_members")
      .delete()
      .eq("org_id", data.orgId)
      .eq("user_id", context.userId);
    return { ok: true };
  });

export const listAllContactMessages = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertSuperAdmin(context.userId);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data, error } = await supabaseAdmin
      .from("contact_messages")
      .select("id, name, email, company, phone, message, created_at")
      .order("created_at", { ascending: false })
      .limit(500);
    if (error) throw new Error(error.message);
    return { messages: data ?? [] };
  });
