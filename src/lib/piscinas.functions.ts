import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { piscinaSchema } from "./schemas";

export const getPiscina = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => z.object({ id: z.string().uuid() }).parse(d))
  .handler(async ({ context, data }) => {
    const { supabase } = context;
    const { data: piscina, error } = await supabase
      .from("piscinas")
      .select("*, clientes(id, nombre)")
      .eq("id", data.id)
      .maybeSingle();
    if (error) throw new Error(error.message);
    if (!piscina) throw new Error("Piscina no encontrada");
    const { data: partes } = await supabase
      .from("partes")
      .select("id, fecha, estado, ph, cloro_libre")
      .eq("piscina_id", data.id)
      .order("fecha", { ascending: false })
      .limit(50);
    return { piscina, partes: partes ?? [] };
  });

export const upsertPiscina = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) =>
    z.object({ id: z.string().uuid().optional(), values: piscinaSchema }).parse(d),
  )
  .handler(async ({ context, data }) => {
    const { supabase, userId } = context;
    const { data: prof } = await supabase
      .from("profiles")
      .select("default_org_id")
      .eq("id", userId)
      .maybeSingle();
    if (!prof?.default_org_id) throw new Error("Sin organización");
    if (data.id) {
      const { data: row, error } = await supabase
        .from("piscinas")
        .update(data.values)
        .eq("id", data.id)
        .select("id")
        .single();
      if (error) throw new Error(error.message);
      return { id: row.id };
    }
    const { data: row, error } = await supabase
      .from("piscinas")
      .insert({ ...data.values, org_id: prof.default_org_id })
      .select("id")
      .single();
    if (error) throw new Error(error.message);
    return { id: row.id };
  });

export const listPiscinas = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data, error } = await context.supabase
      .from("piscinas")
      .select("id, alias, clientes(nombre)")
      .eq("archived", false)
      .order("alias")
      .limit(500);
    if (error) throw new Error(error.message);
    return { piscinas: data ?? [] };
  });
