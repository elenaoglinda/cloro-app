import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { ArrowLeft, ChevronDown, Upload } from "lucide-react";
import { listPiscinas } from "@/lib/piscinas.functions";
import { createParte, updateParte, updateParteAdjunto } from "@/lib/partes.functions";
import { getMyContext } from "@/lib/orgs.functions";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Select, SelectTrigger, SelectValue, SelectContent, SelectItem,
} from "@/components/ui/select";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { toast } from "sonner";
import {
  cloroCombinado, dotClass, evalCloroCombinado, evalCloroLibre, evalPh,
  evalTemperatura, evalTransparencia, evalTurbidez, textClass, type Estado,
} from "@/lib/parte-ranges";

export const Route = createFileRoute("/_authenticated/app/partes/nuevo")({
  component: NuevoParte,
});

type TipoControl = "rutina" | "periodico" | "inicial";

const todayISO = () => new Date().toISOString().slice(0, 10);
const nowHHMM = () => {
  const d = new Date();
  return `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
};

function StatusDot({ estado }: { estado: Estado }) {
  return <span className={`inline-block size-2.5 rounded-full ${dotClass[estado]}`} />;
}

function NumField({
  label, value, onChange, step = "0.1", estado, unit, hint,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  step?: string;
  estado?: Estado;
  unit?: string;
  hint?: string;
}) {
  return (
    <div>
      <Label className="text-xs flex items-center gap-2">
        <span>{label}{unit ? ` (${unit})` : ""}</span>
        {estado && <StatusDot estado={estado} />}
      </Label>
      <Input
        type="number" step={step} inputMode="decimal"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
      {hint && <p className="text-[11px] text-muted-foreground mt-1">{hint}</p>}
    </div>
  );
}

export type ParteFormInitial = Partial<{
  piscina_id: string;
  tipo_control: TipoControl;
  fecha: string;
  hora_medicion: string;
  ph: string; cloro_libre: string; cloro_total: string; turbidez: string;
  transparencia_fondo: "" | "si" | "no";
  temp_c: string; redox: string; tiempo_recirculacion: string;
  cya: string; alcalinidad: string; sal: string;
  ecoli: "" | "ok" | "ko";
  pseudomonas: "" | "ok" | "ko";
  bromo_total: string;
  observaciones: string;
  productos_usados_texto: string;
}>;

function NuevoParte() {
  return <ParteForm mode="create" />;
}

export function ParteForm({
  mode,
  parteId,
  initial,
}: {
  mode: "create" | "edit";
  parteId?: string;
  initial?: ParteFormInitial;
}) {
  const navigate = useNavigate();
  const piscinasFn = useServerFn(listPiscinas);
  const createFn = useServerFn(createParte);
  const updateFn = useServerFn(updateParte);
  const updateAdjFn = useServerFn(updateParteAdjunto);
  const ctxFn = useServerFn(getMyContext);
  const { data: piscinas } = useQuery({ queryKey: ["piscinas"], queryFn: () => piscinasFn() });
  const { data: ctx } = useQuery({ queryKey: ["ctx"], queryFn: () => ctxFn() });
  const [submitting, setSubmitting] = useState(false);
  const [otrosOpen, setOtrosOpen] = useState(false);
  const [labFile, setLabFile] = useState<File | null>(null);

  const [form, setForm] = useState({
    piscina_id: initial?.piscina_id ?? "",
    tipo_control: (initial?.tipo_control ?? "rutina") as TipoControl,
    fecha: initial?.fecha ?? todayISO(),
    hora_medicion: initial?.hora_medicion ?? nowHHMM(),
    ph: initial?.ph ?? "", cloro_libre: initial?.cloro_libre ?? "",
    cloro_total: initial?.cloro_total ?? "", turbidez: initial?.turbidez ?? "",
    transparencia_fondo: (initial?.transparencia_fondo ?? "") as "" | "si" | "no",
    temp_c: initial?.temp_c ?? "", redox: initial?.redox ?? "",
    tiempo_recirculacion: initial?.tiempo_recirculacion ?? "",
    cya: initial?.cya ?? "", alcalinidad: initial?.alcalinidad ?? "", sal: initial?.sal ?? "",
    ecoli: (initial?.ecoli ?? "") as "" | "ok" | "ko",
    pseudomonas: (initial?.pseudomonas ?? "") as "" | "ok" | "ko",
    bromo_total: initial?.bromo_total ?? "",
    observaciones: initial?.observaciones ?? "",
    productos_usados_texto: initial?.productos_usados_texto ?? "",
  });

  const isLab = form.tipo_control !== "rutina";
  const cc = useMemo(
    () => cloroCombinado(
      form.cloro_libre === "" ? null : Number(form.cloro_libre),
      form.cloro_total === "" ? null : Number(form.cloro_total),
    ),
    [form.cloro_libre, form.cloro_total],
  );
  const ccEstado = evalCloroCombinado(cc);

  const set = <K extends keyof typeof form>(k: K, v: (typeof form)[K]) =>
    setForm((f) => ({ ...f, [k]: v }));

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.piscina_id) { toast.error("Selecciona una piscina"); return; }
    setSubmitting(true);
    try {
      const fechaISO = new Date(`${form.fecha}T${form.hora_medicion || "00:00"}:00`).toISOString();
      const payload: any = {
        piscina_id: form.piscina_id,
        estado: "completado",
        tipo_control: form.tipo_control,
        fecha: fechaISO,
        hora_medicion: form.hora_medicion || null,
        observaciones: form.observaciones || "",
        productos_usados_texto: form.productos_usados_texto || "",
        transparencia_fondo:
          form.transparencia_fondo === "" ? null : form.transparencia_fondo === "si",
        ecoli: isLab && form.ecoli ? form.ecoli === "ok" : null,
        pseudomonas: isLab && form.pseudomonas ? form.pseudomonas === "ok" : null,
      };
      for (const k of [
        "ph","cloro_libre","cloro_total","turbidez","temp_c","redox",
        "tiempo_recirculacion","cya","alcalinidad","sal","bromo_total",
      ] as const) {
        const v = form[k];
        payload[k] = v === "" ? null : Number(v);
      }

      const targetId = mode === "edit" && parteId
        ? (await updateFn({ data: { id: parteId, values: payload } })).id
        : (await createFn({ data: payload })).id;

      if (isLab && labFile && ctx?.currentOrg?.id) {
        try {
          const ext = labFile.name.split(".").pop() || "pdf";
          const path = `${ctx.currentOrg.id}/${targetId}/laboratorio-${crypto.randomUUID()}.${ext}`;
          const { error: upErr } = await supabase.storage
            .from("parte-fotos")
            .upload(path, labFile, { cacheControl: "3600", upsert: false, contentType: labFile.type });
          if (upErr) throw upErr;
          await updateAdjFn({ data: { id: targetId, adjunto_laboratorio_url: path } });
        } catch (err: any) {
          toast.error(`Parte guardado, pero el adjunto falló: ${err.message ?? err}`);
        }
      }

      toast.success(mode === "edit" ? "Parte actualizado" : "Parte creado");
      navigate({ to: "/app/partes/$id", params: { id: targetId } });
    } catch (err: any) {
      toast.error(err?.message ?? "Error");
      setSubmitting(false);
    }
  }

  const recomendado = form.tipo_control === "rutina" ? " (recomendado)" : "";

  return (
    <div className="max-w-2xl mx-auto space-y-6 pb-12">
      <Link to="/app/partes" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="size-4 mr-1" /> Partes
      </Link>
      <h1 className="text-2xl font-semibold">{mode === "edit" ? "Editar parte" : "Nuevo parte"}</h1>

      <form onSubmit={submit} className="space-y-5">
        {/* SECCIÓN A */}
        <section className="bg-card border border-border rounded-lg p-4 space-y-3">
          <h2 className="text-sm font-semibold">A · Información general</h2>
          <div>
            <Label>Piscina *</Label>
            <Select value={form.piscina_id} onValueChange={(v) => set("piscina_id", v)}>
              <SelectTrigger><SelectValue placeholder="Selecciona..." /></SelectTrigger>
              <SelectContent>
                {piscinas?.piscinas.map((p: any) => (
                  <SelectItem key={p.id} value={p.id}>
                    {p.alias} · {p.clientes?.nombre ?? ""}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Tipo de control *</Label>
            <Select value={form.tipo_control} onValueChange={(v) => set("tipo_control", v as TipoControl)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="rutina">Control de rutina (diario)</SelectItem>
                <SelectItem value="periodico">Control periódico (laboratorio)</SelectItem>
                <SelectItem value="inicial">Control inicial (apertura)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>Fecha</Label>
              <Input type="date" value={form.fecha} onChange={(e) => set("fecha", e.target.value)} />
            </div>
            <div>
              <Label>Hora</Label>
              <Input type="time" value={form.hora_medicion} onChange={(e) => set("hora_medicion", e.target.value)} />
            </div>
          </div>
        </section>

        {/* SECCIÓN B */}
        <section className="bg-card border border-border rounded-lg p-4 space-y-3">
          <h2 className="text-sm font-semibold">B · Parámetros de seguridad{recomendado}</h2>
          <p className="text-[11px] text-muted-foreground">Rangos según RD 742/2013.</p>
          <div className="grid grid-cols-2 gap-3">
            <NumField label="pH" value={form.ph} onChange={(v) => set("ph", v)} step="0.01" estado={evalPh(form.ph === "" ? null : Number(form.ph))} />
            <NumField label="Cloro libre" unit="mg/L" value={form.cloro_libre} onChange={(v) => set("cloro_libre", v)} estado={evalCloroLibre(form.cloro_libre === "" ? null : Number(form.cloro_libre))} />
            <NumField label="Cloro total" unit="mg/L" value={form.cloro_total} onChange={(v) => set("cloro_total", v)} />
            <NumField label="Turbidez" unit="UNF" value={form.turbidez} onChange={(v) => set("turbidez", v)} estado={evalTurbidez(form.turbidez === "" ? null : Number(form.turbidez))} />
          </div>
          <div className={`flex items-center justify-between rounded-md border border-border px-3 py-2 text-sm ${textClass[ccEstado]}`}>
            <span className="flex items-center gap-2">
              <StatusDot estado={ccEstado} />
              Cloro combinado
            </span>
            <span className="font-medium">{cc != null ? `${cc.toFixed(2)} mg/L` : "—"}</span>
          </div>
          <div className="flex items-center justify-between rounded-md border border-border px-3 py-2">
            <div>
              <p className="text-sm font-medium">¿Se ve el desagüe de fondo?</p>
              <p className="text-[11px] text-muted-foreground">Transparencia visible hasta el fondo.</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground">
                {form.transparencia_fondo === "" ? "—" : form.transparencia_fondo === "si" ? "Sí" : "No"}
              </span>
              <Switch
                checked={form.transparencia_fondo === "si"}
                onCheckedChange={(c) => set("transparencia_fondo", c ? "si" : "no")}
              />
            </div>
          </div>
        </section>

        {/* SECCIÓN C */}
        <Collapsible open={otrosOpen} onOpenChange={setOtrosOpen} className="bg-card border border-border rounded-lg">
          <CollapsibleTrigger className="w-full flex items-center justify-between p-4">
            <h2 className="text-sm font-semibold">C · Otros parámetros</h2>
            <ChevronDown className={`size-4 transition-transform ${otrosOpen ? "rotate-180" : ""}`} />
          </CollapsibleTrigger>
          <CollapsibleContent className="px-4 pb-4">
            <div className="grid grid-cols-2 gap-3">
              <NumField label="Temperatura" unit="°C" value={form.temp_c} onChange={(v) => set("temp_c", v)} estado={evalTemperatura(form.temp_c === "" ? null : Number(form.temp_c))} />
              <NumField label="REDOX" unit="mV" value={form.redox} onChange={(v) => set("redox", v)} step="1" />
              <NumField label="Tiempo recirculación" unit="h" value={form.tiempo_recirculacion} onChange={(v) => set("tiempo_recirculacion", v)} />
              <NumField label="CYA" unit="mg/L" value={form.cya} onChange={(v) => set("cya", v)} step="1" />
              <NumField label="Alcalinidad" unit="mg/L" value={form.alcalinidad} onChange={(v) => set("alcalinidad", v)} step="1" />
              <NumField label="Sal" unit="g/L" value={form.sal} onChange={(v) => set("sal", v)} />
            </div>
          </CollapsibleContent>
        </Collapsible>

        {/* SECCIÓN D */}
        {isLab && (
          <section className="bg-card border border-border rounded-lg p-4 space-y-3">
            <h2 className="text-sm font-semibold">D · Análisis de laboratorio</h2>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>E. coli</Label>
                <Select value={form.ecoli} onValueChange={(v) => set("ecoli", v as any)}>
                  <SelectTrigger><SelectValue placeholder="—" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ok">Cumple</SelectItem>
                    <SelectItem value="ko">No cumple</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Pseudomonas aeruginosa</Label>
                <Select value={form.pseudomonas} onValueChange={(v) => set("pseudomonas", v as any)}>
                  <SelectTrigger><SelectValue placeholder="—" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ok">Cumple</SelectItem>
                    <SelectItem value="ko">No cumple</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <NumField label="Bromo total" unit="mg/L" value={form.bromo_total} onChange={(v) => set("bromo_total", v)} />
            </div>
            <div>
              <Label>Informe de laboratorio (PDF o imagen)</Label>
              <div className="flex items-center gap-2 mt-1">
                <Input
                  type="file" accept="application/pdf,image/*"
                  onChange={(e) => setLabFile(e.target.files?.[0] ?? null)}
                />
                <Upload className="size-4 text-muted-foreground" />
              </div>
              {labFile && <p className="text-[11px] text-muted-foreground mt-1">{labFile.name}</p>}
            </div>
          </section>
        )}

        {/* SECCIÓN E */}
        <section className="bg-card border border-border rounded-lg p-4 space-y-3">
          <h2 className="text-sm font-semibold">E · Productos y acciones</h2>
          <div>
            <Label>Observaciones</Label>
            <Textarea rows={3} value={form.observaciones} onChange={(e) => set("observaciones", e.target.value)} placeholder="Incidencias detectadas, comentarios..." />
          </div>
          <div>
            <Label>Productos usados</Label>
            <Textarea rows={3} value={form.productos_usados_texto} onChange={(e) => set("productos_usados_texto", e.target.value)} placeholder="Cloro añadido: Xkg, Corrector pH: Xml..." />
          </div>
        </section>

        {/* SECCIÓN F */}
        <section className="bg-card border border-border rounded-lg p-4">
          <h2 className="text-sm font-semibold mb-1">F · Firma del cliente</h2>
          <p className="text-xs text-muted-foreground">La firma se puede añadir desde la vista de detalle tras guardar.</p>
        </section>

        <Button type="submit" className="w-full" size="lg" disabled={submitting}>
          {submitting ? "Guardando..." : "Guardar parte"}
        </Button>
      </form>
    </div>
  );
}
