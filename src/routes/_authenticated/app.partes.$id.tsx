import { createFileRoute, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, Upload, Trash2 } from "lucide-react";
import { useRef, useState } from "react";
import { toast } from "sonner";
import { getParte } from "@/lib/partes.functions";
import { listFotos, registerFoto, deleteFoto } from "@/lib/fotos.functions";
import { getMyContext } from "@/lib/orgs.functions";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/_authenticated/app/partes/$id")({
  component: ParteDetail,
});

function ParteDetail() {
  const { id } = Route.useParams();
  const qc = useQueryClient();
  const getParteFn = useServerFn(getParte);
  const listFotosFn = useServerFn(listFotos);
  const registerFotoFn = useServerFn(registerFoto);
  const deleteFotoFn = useServerFn(deleteFoto);
  const ctxFn = useServerFn(getMyContext);
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  const { data, isLoading } = useQuery({ queryKey: ["parte", id], queryFn: () => getParteFn({ data: { id } }) });
  const { data: fotosData } = useQuery({ queryKey: ["parte-fotos", id], queryFn: () => listFotosFn({ data: { parte_id: id } }) });
  const { data: ctx } = useQuery({ queryKey: ["ctx"], queryFn: () => ctxFn() });

  if (isLoading) return <p className="text-sm text-muted-foreground">Cargando...</p>;
  if (!data) return null;
  const p: any = data.parte;
  const rows: [string, any][] = [
    ["pH", p.ph], ["Cloro libre", p.cloro_libre], ["Cloro total", p.cloro_total],
    ["Alcalinidad", p.alcalinidad], ["CYA", p.cya], ["Sal", p.sal], ["Temperatura", p.temp_c],
  ];

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (!files || files.length === 0 || !ctx?.currentOrg?.id) return;
    setUploading(true);
    try {
      for (const file of Array.from(files)) {
        const ext = file.name.split(".").pop() || "jpg";
        const path = `${ctx.currentOrg.id}/${id}/${crypto.randomUUID()}.${ext}`;
        const { error } = await supabase.storage.from("parte-fotos").upload(path, file, {
          cacheControl: "3600", upsert: false, contentType: file.type,
        });
        if (error) throw error;
        await registerFotoFn({ data: { parte_id: id, storage_path: path } });
      }
      toast.success("Fotos subidas");
      qc.invalidateQueries({ queryKey: ["parte-fotos", id] });
    } catch (err: any) {
      toast.error(err.message || "Error al subir");
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  }

  async function handleDelete(fotoId: string) {
    await deleteFotoFn({ data: { id: fotoId } });
    qc.invalidateQueries({ queryKey: ["parte-fotos", id] });
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <Link to="/app/partes" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="size-4 mr-1" /> Partes
      </Link>
      <div>
        <p className="text-sm text-muted-foreground">{new Date(p.fecha).toLocaleString("es-ES")} · {p.estado}</p>
        <h1 className="text-2xl font-semibold">{p.piscinas?.alias} · {p.piscinas?.clientes?.nombre}</h1>
      </div>
      <div className="bg-card border border-border rounded-lg p-5">
        <h2 className="text-sm font-semibold mb-3">Mediciones</h2>
        <dl className="grid grid-cols-2 gap-3 text-sm">
          {rows.map(([k, v]) => (
            <div key={k} className="flex justify-between border-b border-border/60 py-1">
              <dt className="text-muted-foreground">{k}</dt>
              <dd className="font-medium">{v ?? "—"}</dd>
            </div>
          ))}
        </dl>
      </div>
      {p.observaciones && (
        <div className="bg-card border border-border rounded-lg p-5">
          <h2 className="text-sm font-semibold mb-2">Observaciones</h2>
          <p className="text-sm whitespace-pre-wrap">{p.observaciones}</p>
        </div>
      )}

      <div className="bg-card border border-border rounded-lg p-5">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold">Fotos</h2>
          <Button size="sm" variant="outline" onClick={() => fileRef.current?.click()} disabled={uploading}>
            <Upload className="size-4 mr-2" /> {uploading ? "Subiendo..." : "Subir"}
          </Button>
          <input ref={fileRef} type="file" accept="image/*" multiple className="hidden" onChange={handleUpload} />
        </div>
        {!fotosData?.fotos.length ? (
          <p className="text-sm text-muted-foreground">Sin fotos aún.</p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {fotosData.fotos.map((f) => (
              <div key={f.id} className="relative group aspect-square rounded-md overflow-hidden bg-muted">
                {f.url && <img src={f.url} alt="" className="w-full h-full object-cover" />}
                <button
                  onClick={() => handleDelete(f.id)}
                  className="absolute top-1 right-1 size-7 bg-background/90 rounded flex items-center justify-center opacity-0 group-hover:opacity-100 transition"
                >
                  <Trash2 className="size-3.5" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
