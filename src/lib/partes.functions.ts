import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { parteSchema } from "./schemas";

const PARTE_SELECT_LIST =
  "id, fecha, estado, tipo_control, ph, cloro_libre, cloro_total, turbidez, transparencia_fondo, temp_c, piscinas(alias, clientes(nombre))";

export const listPartes = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data, error } = await context.supabase
      .from("partes")
      .select(PARTE_SELECT_LIST)
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
      .select("*, piscinas(id, alias, direccion, clientes(id, nombre))")
      .eq("id", data.id)
      .maybeSingle();
    if (error) throw new Error(error.message);
    if (!parte) throw new Error("Parte no encontrado");

    let adjunto_url: string | null = null;
    if ((parte as any).adjunto_laboratorio_url) {
      const path = (parte as any).adjunto_laboratorio_url as string;
      const { data: s } = await context.supabase.storage
        .from("parte-fotos")
        .createSignedUrl(path, 60 * 60);
      adjunto_url = s?.signedUrl ?? null;
    }
    return { parte, adjunto_url };
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

    const { productos_usados_texto, fecha, ...rest } = data as any;
    const productos_usados = productos_usados_texto
      ? [{ texto: productos_usados_texto }]
      : [];

    const insertRow: any = {
      ...rest,
      productos_usados,
      org_id: prof.default_org_id,
      tecnico_id: userId,
      fecha: fecha ? new Date(fecha).toISOString() : new Date().toISOString(),
    };

    const { data: row, error } = await supabase
      .from("partes")
      .insert(insertRow)
      .select("id")
      .single();
    if (error) throw new Error(error.message);
    return { id: row.id };
  });

export const updateParteAdjunto = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) =>
    z
      .object({
        id: z.string().uuid(),
        adjunto_laboratorio_url: z.string().min(1).max(1000).nullable(),
      })
      .parse(d),
  )
  .handler(async ({ context, data }) => {
    const { error } = await context.supabase
      .from("partes")
      .update({ adjunto_laboratorio_url: data.adjunto_laboratorio_url })
      .eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const updateParte = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) =>
    z.object({ id: z.string().uuid(), values: parteSchema }).parse(d),
  )
  .handler(async ({ context, data }) => {
    const { supabase } = context;
    const { data: existing, error: exErr } = await supabase
      .from("partes")
      .select("estado")
      .eq("id", data.id)
      .maybeSingle();
    if (exErr) throw new Error(exErr.message);
    if (!existing) throw new Error("Parte no encontrado");
    if (existing.estado === "firmado") throw new Error("El parte está firmado y no puede editarse");

    const { productos_usados_texto, fecha, ...rest } = data.values as any;
    const productos_usados = productos_usados_texto
      ? [{ texto: productos_usados_texto }]
      : [];
    const updateRow: any = {
      ...rest,
      productos_usados,
      fecha: fecha ? new Date(fecha).toISOString() : undefined,
    };
    const { error } = await supabase
      .from("partes")
      .update(updateRow)
      .eq("id", data.id);
    if (error) throw new Error(error.message);
    return { id: data.id };
  });

export const updateParteFirma = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) =>
    z.object({
      id: z.string().uuid(),
      firma_cliente_url: z.string().min(1).max(1000).nullable(),
    }).parse(d),
  )
  .handler(async ({ context, data }) => {
    const update: any = { firma_cliente_url: data.firma_cliente_url };
    if (data.firma_cliente_url) update.estado = "firmado";
    const { error } = await context.supabase
      .from("partes")
      .update(update)
      .eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });
