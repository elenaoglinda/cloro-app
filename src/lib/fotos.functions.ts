import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

export const listFotos = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => z.object({ parte_id: z.string().uuid() }).parse(d))
  .handler(async ({ context, data }) => {
    const { supabase } = context;
    const { data: rows, error } = await supabase
      .from("parte_fotos")
      .select("id, storage_path, created_at")
      .eq("parte_id", data.parte_id)
      .order("created_at", { ascending: false });
    if (error) throw new Error(error.message);

    const signed = await Promise.all(
      (rows ?? []).map(async (r) => {
        const { data: s } = await supabase.storage
          .from("parte-fotos")
          .createSignedUrl(r.storage_path, 60 * 60);
        return { ...r, url: s?.signedUrl ?? null };
      }),
    );
    return { fotos: signed };
  });

export const registerFoto = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) =>
    z.object({ parte_id: z.string().uuid(), storage_path: z.string().min(3).max(500) }).parse(d),
  )
  .handler(async ({ context, data }) => {
    const { supabase, userId } = context;
    const { data: prof } = await supabase
      .from("profiles").select("default_org_id").eq("id", userId).maybeSingle();
    if (!prof?.default_org_id) throw new Error("Sin organización");
    const { error } = await supabase.from("parte_fotos").insert({
      parte_id: data.parte_id,
      storage_path: data.storage_path,
      org_id: prof.default_org_id,
    });
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const deleteFoto = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => z.object({ id: z.string().uuid() }).parse(d))
  .handler(async ({ context, data }) => {
    const { supabase } = context;
    const { data: row } = await supabase
      .from("parte_fotos").select("storage_path").eq("id", data.id).maybeSingle();
    if (row?.storage_path) {
      await supabase.storage.from("parte-fotos").remove([row.storage_path]);
    }
    const { error } = await supabase.from("parte_fotos").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });
