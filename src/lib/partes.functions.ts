import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { parteSchema } from "./schemas";

export const listPartes = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data, error } = await context.supabase
      .from("partes")
      .select("id, fecha, estado, ph, cloro_libre, piscinas(alias, clientes(nombre))")
      .order("fecha", { ascending: false })
      .limit(100);
    if (error) throw new Error(error.message);
    return { partes: data ?? [] };
  });

export const getParte = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => z.object({ id: z.string().uuid() }).parse(d))
  .handler(async ({ context, data }) => {
    const { data: parte, error } = await context.supabase
      .from("partes")
      .select("*, piscinas(id, alias, clientes(id, nombre))")
      .eq("id", data.id)
      .maybeSingle();
    if (error) throw new Error(error.message);
    if (!parte) throw new Error("Parte no encontrado");
    return { parte };
  });

export const createParte = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => parteSchema.parse(d))
  .handler(async ({ context, data }) => {
    const { supabase, userId } = context;
    const { data: prof } = await supabase
      .from("profiles")
      .select("default_org_id")
      .eq("id", userId)
      .maybeSingle();
    if (!prof?.default_org_id) throw new Error("Sin organización");
    const { data: row, error } = await supabase
      .from("partes")
      .insert({
        ...data,
        org_id: prof.default_org_id,
        tecnico_id: userId,
        fecha: new Date().toISOString(),
      })
      .select("id")
      .single();
    if (error) throw new Error(error.message);
    return { id: row.id };
  });
