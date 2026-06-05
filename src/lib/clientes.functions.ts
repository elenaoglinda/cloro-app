import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { clienteSchema } from "./schemas";

async function getOrgId(supabase: any, userId: string) {
  const { data } = await supabase
    .from("profiles")
    .select("default_org_id")
    .eq("id", userId)
    .maybeSingle();
  if (!data?.default_org_id) throw new Error("No tienes organización activa");
  return data.default_org_id as string;
}

export const listClientes = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) =>
    z.object({ q: z.string().trim().max(100).optional() }).parse(d ?? {}),
  )
  .handler(async ({ context, data }) => {
    const { supabase } = context;
    let q = supabase
      .from("clientes")
      .select("id, nombre, email, telefono, direccion, archived, created_at")
      .eq("archived", false)
      .order("nombre", { ascending: true })
      .limit(200);
    if (data.q) q = q.ilike("nombre", `%${data.q}%`);
    const { data: rows, error } = await q;
    if (error) throw new Error(error.message);
    return { clientes: rows ?? [] };
  });

export const getCliente = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => z.object({ id: z.string().uuid() }).parse(d))
  .handler(async ({ context, data }) => {
    const { supabase } = context;
    const { data: cliente, error } = await supabase
      .from("clientes")
      .select("*")
      .eq("id", data.id)
      .maybeSingle();
    if (error) throw new Error(error.message);
    if (!cliente) throw new Error("Cliente no encontrado");
    const { data: piscinas } = await supabase
      .from("piscinas")
      .select("id, alias, tipo, volumen_m3, sistema_desinfeccion, archived")
      .eq("cliente_id", data.id)
      .eq("archived", false)
      .order("alias");
    return { cliente, piscinas: piscinas ?? [] };
  });

export const upsertCliente = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) =>
    z.object({ id: z.string().uuid().optional(), values: clienteSchema }).parse(d),
  )
  .handler(async ({ context, data }) => {
    const { supabase, userId } = context;
    const org_id = await getOrgId(supabase, userId);
    if (data.id) {
      const { data: row, error } = await supabase
        .from("clientes")
        .update(data.values)
        .eq("id", data.id)
        .select("id")
        .single();
      if (error) throw new Error(error.message);
      return { id: row.id };
    }
    const { data: row, error } = await supabase
      .from("clientes")
      .insert({ ...data.values, org_id })
      .select("id")
      .single();
    if (error) throw new Error(error.message);
    return { id: row.id };
  });

export const archiveCliente = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => z.object({ id: z.string().uuid() }).parse(d))
  .handler(async ({ context, data }) => {
    const { error } = await context.supabase
      .from("clientes")
      .update({ archived: true })
      .eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });
