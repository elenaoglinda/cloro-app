import { createFileRoute, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, Upload, Trash2, FileText, Pencil } from "lucide-react";
import { useRef, useState } from "react";
import { toast } from "sonner";
import { getParte, updateParteFirma } from "@/lib/partes.functions";
import { listFotos, registerFoto, deleteFoto } from "@/lib/fotos.functions";
import { getMyContext } from "@/lib/orgs.functions";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { SignaturePad } from "@/components/app/SignaturePad";
import {
  cloroCombinado, dotClass, evalCloroCombinado, evalCloroLibre, evalPh,
  evalTemperatura, evalTransparencia, evalTurbidez, semaforoParte, textClass, type Estado,
} from "@/lib/parte-ranges";

export const Route = createFileRoute("/_authenticated/app/partes/$id")({
  component: ParteDetail,
});

const tipoLabel: Record<string, string> = {
  rutina: "Control de rutina",
  periodico: "Control periódico",
  inicial: "Control inicial",
};

const estadoLabel: Record<Estado, string> = {
  ok: "Conforme",
  alerta: "En alerta",
  critico: "Cierre obligatorio",
  neutro: "Sin datos",
};

function Dot({ estado }: { estado: Estado }) {
  return <span className={`inline-block size-2.5 rounded-full ${dotClass[estado]}`} />;
}

function Row({ label, value, estado, unit }: { label: string; value: any; estado?: Estado; unit?: string }) {
  const e = estado ?? "neutro";
  return (
    <div className="flex items-center justify-between border-b border-border/60 py-1.5 text-sm">
      <dt className="text-muted-foreground flex items-center gap-2">
        {estado && <Dot estado={e} />}
        {label}
      </dt>
      <dd className={`font-medium ${estado ? textClass[e] : ""}`}>
        {value == null || value === "" ? "—" : `${value}${unit ? ` ${unit}` : ""}`}
      </dd>
    </div>
  );
}

function ParteDetail() {
  const { id } = Route.useParams();
  const qc = useQueryClient();
  const getParteFn = useServerFn(getParte);
  const listFotosFn = useServerFn(listFotos);
  const registerFotoFn = useServerFn(registerFoto);
  const deleteFotoFn = useServerFn(deleteFoto);
  const updateFirmaFn = useServerFn(updateParteFirma);
  const ctxFn = useServerFn(getMyContext);
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [savingFirma, setSavingFirma] = useState(false);

  const { data, isLoading } = useQuery({ queryKey: ["parte", id], queryFn: () => getParteFn({ data: { id } }) });
  const { data: fotosData } = useQuery({ queryKey: ["parte-fotos", id], queryFn: () => listFotosFn({ data: { parte_id: id } }) });
  const { data: ctx } = useQuery({ queryKey: ["ctx"], queryFn: () => ctxFn() });

  if (isLoading) return <p className="text-sm text-muted-foreground">Cargando...</p>;
  if (!data) return null;
  const p: any = data.parte;

  const cc = cloroCombinado(p.cloro_libre, p.cloro_total);
  const semaforo = semaforoParte(p);
  const isLab = p.tipo_control !== "rutina";

  const hora = p.hora_medicion ? String(p.hora_medicion).slice(0, 5) : null;
  const fechaStr = new Date(p.fecha).toLocaleString("es-ES");

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

  async function saveFirma(blob: Blob) {
    if (!ctx?.currentOrg?.id) return;
    setSavingFirma(true);
    try {
      const path = `${ctx.currentOrg.id}/${id}/firma-${crypto.randomUUID()}.png`;
      const { error } = await supabase.storage
        .from("parte-fotos")
        .upload(path, blob, { cacheControl: "3600", upsert: false, contentType: "image/png" });
      if (error) throw error;
      await updateFirmaFn({ data: { id, firma_cliente_url: path } });
      toast.success("Firma guardada. El parte queda firmado.");
      qc.invalidateQueries({ queryKey: ["parte", id] });
    } catch (err: any) {
      toast.error(err.message || "Error al guardar firma");
    } finally {
      setSavingFirma(false);
    }
  }

  const productosTexto =
    Array.isArray(p.productos_usados) && p.productos_usados.length > 0
      ? p.productos_usados.map((x: any) => x.texto ?? JSON.stringify(x)).join("\n")
      : null;

  return (
    <div className="max-w-2xl mx-auto space-y-6 pb-12">
      <Link to="/app/partes" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="size-4 mr-1" /> Partes
      </Link>

      {/* Cabecera */}
      <div className="bg-card border border-border rounded-lg p-5">
        <div className="flex items-start gap-3">
          <span className={`mt-1 size-3 rounded-full ${dotClass[semaforo]}`} title={estadoLabel[semaforo]} />
          <div className="flex-1 min-w-0">
            <h1 className="text-xl font-semibold truncate">
              {p.piscinas?.alias} · {p.piscinas?.clientes?.nombre}
            </h1>
            <p className="text-xs text-muted-foreground mt-1">
              {fechaStr}{hora ? ` · ${hora}` : ""} · {tipoLabel[p.tipo_control] ?? p.tipo_control}
            </p>
            <p className={`text-xs font-medium mt-1 ${textClass[semaforo]}`}>{estadoLabel[semaforo]}</p>
          </div>
          {p.estado !== "firmado" && (
            <Link to="/app/partes/$id/editar" params={{ id }}>
              <Button size="sm" variant="outline"><Pencil className="size-4 mr-1" /> Editar</Button>
            </Link>
          )}
        </div>
      </div>

      {/* Sección B */}
      <div className="bg-card border border-border rounded-lg p-5">
        <h2 className="text-sm font-semibold mb-3">Parámetros de seguridad</h2>
        <dl>
          <Row label="pH" value={p.ph} estado={evalPh(p.ph)} />
          <Row label="Cloro libre" value={p.cloro_libre} estado={evalCloroLibre(p.cloro_libre)} unit="mg/L" />
          <Row label="Cloro total" value={p.cloro_total} unit="mg/L" />
          <Row label="Cloro combinado" value={cc != null ? cc.toFixed(2) : null} estado={evalCloroCombinado(cc)} unit="mg/L" />
          <Row label="Turbidez" value={p.turbidez} estado={evalTurbidez(p.turbidez)} unit="UNF" />
          <Row
            label="Desagüe de fondo visible"
            value={p.transparencia_fondo == null ? null : p.transparencia_fondo ? "Sí" : "No"}
            estado={evalTransparencia(p.transparencia_fondo)}
          />
        </dl>
      </div>

      {/* Sección C */}
      <div className="bg-card border border-border rounded-lg p-5">
        <h2 className="text-sm font-semibold mb-3">Otros parámetros</h2>
        <dl>
          <Row label="Temperatura" value={p.temp_c} estado={evalTemperatura(p.temp_c)} unit="°C" />
          <Row label="REDOX" value={p.redox} unit="mV" />
          <Row label="Tiempo recirculación" value={p.tiempo_recirculacion} unit="h" />
          <Row label="CYA" value={p.cya} unit="mg/L" />
          <Row label="Alcalinidad" value={p.alcalinidad} unit="mg/L" />
          <Row label="Sal" value={p.sal} unit="g/L" />
        </dl>
      </div>

      {/* Sección D */}
      {isLab && (
        <div className="bg-card border border-border rounded-lg p-5">
          <h2 className="text-sm font-semibold mb-3">Análisis de laboratorio</h2>
          <dl>
            <Row
              label="E. coli"
              value={p.ecoli == null ? null : p.ecoli ? "Cumple" : "No cumple"}
              estado={p.ecoli == null ? "neutro" : p.ecoli ? "ok" : "critico"}
            />
            <Row
              label="Pseudomonas aeruginosa"
              value={p.pseudomonas == null ? null : p.pseudomonas ? "Cumple" : "No cumple"}
              estado={p.pseudomonas == null ? "neutro" : p.pseudomonas ? "ok" : "critico"}
            />
            <Row label="Bromo total" value={p.bromo_total} unit="mg/L" />
          </dl>
          {data.adjunto_url && (
            <a href={data.adjunto_url} target="_blank" rel="noreferrer" className="mt-3 inline-flex items-center text-sm text-primary hover:underline">
              <FileText className="size-4 mr-1.5" /> Ver informe de laboratorio
            </a>
          )}
        </div>
      )}

      {/* Sección E */}
      {(p.observaciones || productosTexto) && (
        <div className="bg-card border border-border rounded-lg p-5 space-y-3">
          <h2 className="text-sm font-semibold">Productos y acciones</h2>
          {p.observaciones && (
            <div>
              <p className="text-xs text-muted-foreground mb-1">Observaciones</p>
              <p className="text-sm whitespace-pre-wrap">{p.observaciones}</p>
            </div>
          )}
          {productosTexto && (
            <div>
              <p className="text-xs text-muted-foreground mb-1">Productos usados</p>
              <p className="text-sm whitespace-pre-wrap">{productosTexto}</p>
            </div>
          )}
        </div>
      )}

      {/* Firma */}
      {p.firma_cliente_url && (
        <div className="bg-card border border-border rounded-lg p-5">
          <h2 className="text-sm font-semibold mb-3">Firma del cliente</h2>
          <img src={p.firma_cliente_url} alt="Firma cliente" className="max-h-40 bg-white rounded border border-border" />
        </div>
      )}

      {/* Fotos */}
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
