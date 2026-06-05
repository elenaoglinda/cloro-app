import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

export const rutaSchema = z.object({
  nombre: z.string().trim().min(1).max(120),
  fecha: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  notas: z.string().trim().max(2000).optional().nullable(),
});

export const listRutas = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data, error } = await context.supabase
      .from("rutas")
      .select("id, nombre, fecha, notas, ruta_paradas(id, completada)")
      .order("fecha", { ascending: false })
      .limit(100);
    if (error) throw new Error(error.message);
    return { rutas: data ?? [] };
  });

export const getRuta = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => z.object({ id: z.string().uuid() }).parse(d))
  .handler(async ({ context, data }) => {
    const { data: ruta, error } = await context.supabase
      .from("rutas")
      .select("id, nombre, fecha, notas")
      .eq("id", data.id)
      .maybeSingle();
    if (error) throw new Error(error.message);
    if (!ruta) throw new Error("Ruta no encontrada");
    const { data: paradas } = await context.supabase
      .from("ruta_paradas")
      .select("id, orden, completada, piscina_id, piscinas(alias, direccion, lat, lng, clientes(nombre))")
      .eq("ruta_id", data.id)
      .order("orden");
    return { ruta, paradas: paradas ?? [] };
  });

export const createRuta = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => rutaSchema.parse(d))
  .handler(async ({ context, data }) => {
    const { supabase, userId } = context;
    const { data: prof } = await supabase.from("profiles").select("default_org_id").eq("id", userId).maybeSingle();
    if (!prof?.default_org_id) throw new Error("Sin organización");
    const { data: row, error } = await supabase
      .from("rutas")
      .insert({ ...data, org_id: prof.default_org_id, tecnico_id: userId })
      .select("id")
      .single();
    if (error) throw new Error(error.message);
    return { id: row.id };
  });

export const addParada = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) =>
    z.object({ ruta_id: z.string().uuid(), piscina_id: z.string().uuid() }).parse(d),
  )
  .handler(async ({ context, data }) => {
    const { supabase, userId } = context;
    const { data: prof } = await supabase.from("profiles").select("default_org_id").eq("id", userId).maybeSingle();
    if (!prof?.default_org_id) throw new Error("Sin organización");
    const { count, error: countErr } = await supabase
      .from("ruta_paradas")
      .select("*", { count: "exact", head: true })
      .eq("ruta_id", data.ruta_id);
    if (countErr) {
      console.error("addParada count error", countErr);
      throw new Error(countErr.message);
    }
    const { error } = await supabase.from("ruta_paradas").insert({
      ruta_id: data.ruta_id,
      piscina_id: data.piscina_id,
      org_id: prof.default_org_id,
      orden: count ?? 0,
    });
    if (error) {
      console.error("addParada insert error", error);
      throw new Error(error.message);
    }
    return { ok: true };
  });

export const toggleParada = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) =>
    z.object({ id: z.string().uuid(), completada: z.boolean() }).parse(d),
  )
  .handler(async ({ context, data }) => {
    const { error } = await context.supabase.from("ruta_paradas").update({ completada: data.completada }).eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const removeParada = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => z.object({ id: z.string().uuid() }).parse(d))
  .handler(async ({ context, data }) => {
    const { error } = await context.supabase.from("ruta_paradas").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const deleteRuta = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => z.object({ id: z.string().uuid() }).parse(d))
  .handler(async ({ context, data }) => {
    const { error } = await context.supabase.from("rutas").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

const GMAPS_GATEWAY = "https://connector-gateway.lovable.dev/google_maps";

export const optimizeRuta = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => z.object({ id: z.string().uuid() }).parse(d))
  .handler(async ({ context, data }) => {
    const { supabase } = context;
    const { data: paradas, error } = await supabase
      .from("ruta_paradas")
      .select("id, orden, piscina_id")
      .eq("ruta_id", data.id)
      .order("orden");
    if (error) throw new Error(error.message);
    const ids = (paradas ?? []).map((p: any) => p.piscina_id);
    if (!ids.length) throw new Error("Sin paradas.");
    const { data: pisc } = await supabase
      .from("piscinas")
      .select("id, lat, lng")
      .in("id", ids);
    const piscMap = new Map((pisc ?? []).map((p: any) => [p.id, p]));
    const valid = (paradas ?? [])
      .map((p: any) => ({ ...p, pisc: piscMap.get(p.piscina_id) }))
      .filter((p: any) => p.pisc?.lat != null && p.pisc?.lng != null);
    if (valid.length < 3) {
      throw new Error("Necesitas al menos 3 paradas con coordenadas para optimizar.");
    }

    const origin = valid[0];
    const destination = valid[valid.length - 1];
    const intermediates = valid.slice(1, -1);

    const lovableKey = process.env.LOVABLE_API_KEY;
    const gmapsKey = process.env.GOOGLE_MAPS_API_KEY;
    if (!lovableKey || !gmapsKey) throw new Error("Google Maps no está configurado.");

    const body = {
      origin: { location: { latLng: { latitude: Number(origin.pisc.lat), longitude: Number(origin.pisc.lng) } } },
      destination: { location: { latLng: { latitude: Number(destination.pisc.lat), longitude: Number(destination.pisc.lng) } } },
      intermediates: intermediates.map((p: any) => ({
        location: { latLng: { latitude: Number(p.pisc.lat), longitude: Number(p.pisc.lng) } },
      })),
      travelMode: "DRIVE",
      optimizeWaypointOrder: true,
    };

    const res = await fetch(`${GMAPS_GATEWAY}/routes/directions/v2:computeRoutes`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${lovableKey}`,
        "X-Connection-Api-Key": gmapsKey,
        "Content-Type": "application/json",
        "X-Goog-FieldMask": "routes.optimizedIntermediateWaypointIndex,routes.polyline.encodedPolyline,routes.duration,routes.distanceMeters",
      },
      body: JSON.stringify(body),
    });
    if (!res.ok) {
      const t = await res.text();
      console.error("optimizeRuta gmaps error", res.status, t);
      throw new Error("No se pudo optimizar la ruta.");
    }
    const json: any = await res.json();
    const route = json.routes?.[0];
    if (!route) throw new Error("Sin resultados de Google Maps.");

    const optimizedIdx: number[] = route.optimizedIntermediateWaypointIndex ?? intermediates.map((_, i) => i);
    const newOrder = [origin, ...optimizedIdx.map((i) => intermediates[i]), destination];

    // Persist new orden
    for (let i = 0; i < newOrder.length; i++) {
      await supabase.from("ruta_paradas").update({ orden: i }).eq("id", newOrder[i].id);
    }

    return {
      polyline: route.polyline?.encodedPolyline ?? null,
      distanceMeters: route.distanceMeters ?? null,
      duration: route.duration ?? null,
    };
  });
