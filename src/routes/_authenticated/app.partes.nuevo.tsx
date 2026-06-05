import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { ArrowLeft } from "lucide-react";
import { listPiscinas } from "@/lib/piscinas.functions";
import { createParte } from "@/lib/partes.functions";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select, SelectTrigger, SelectValue, SelectContent, SelectItem,
} from "@/components/ui/select";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/app/partes/nuevo")({
  component: NuevoParte,
});

function NuevoParte() {
  const navigate = useNavigate();
  const piscinasFn = useServerFn(listPiscinas);
  const createFn = useServerFn(createParte);
  const { data: piscinas } = useQuery({ queryKey: ["piscinas"], queryFn: () => piscinasFn() });
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    piscina_id: "",
    ph: "", cloro_libre: "", cloro_total: "",
    alcalinidad: "", cya: "", sal: "", temp_c: "",
    observaciones: "",
  });

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.piscina_id) { toast.error("Selecciona una piscina"); return; }
    setSubmitting(true);
    try {
      const payload: any = {
        piscina_id: form.piscina_id,
        estado: "completado",
        observaciones: form.observaciones || null,
      };
      for (const k of ["ph","cloro_libre","cloro_total","alcalinidad","cya","sal","temp_c"]) {
        const v = (form as any)[k];
        payload[k] = v === "" ? null : Number(v);
      }
      const res = await createFn({ data: payload });
      toast.success("Parte creado");
      navigate({ to: "/app/partes/$id", params: { id: res.id } });
    } catch (err: any) {
      toast.error(err?.message ?? "Error");
      setSubmitting(false);
    }
  }

  const F = (k: keyof typeof form, label: string, step = "0.1") => (
    <div>
      <Label className="text-xs">{label}</Label>
      <Input
        type="number" step={step} inputMode="decimal"
        value={form[k] as string}
        onChange={(e) => setForm({ ...form, [k]: e.target.value })}
      />
    </div>
  );

  return (
    <div className="max-w-xl mx-auto space-y-6">
      <Link to="/app/partes" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="size-4 mr-1" /> Partes
      </Link>
      <h1 className="text-2xl font-semibold">Nuevo parte</h1>

      <form onSubmit={submit} className="space-y-5">
        <div>
          <Label>Piscina *</Label>
          <Select value={form.piscina_id} onValueChange={(v) => setForm({ ...form, piscina_id: v })}>
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

        <div className="bg-card border border-border rounded-lg p-4">
          <h3 className="text-sm font-semibold mb-3">Mediciones</h3>
          <div className="grid grid-cols-2 gap-3">
            {F("ph", "pH", "0.01")}
            {F("cloro_libre", "Cloro libre (ppm)")}
            {F("cloro_total", "Cloro total (ppm)")}
            {F("alcalinidad", "Alcalinidad (ppm)", "1")}
            {F("cya", "CYA (ppm)", "1")}
            {F("sal", "Sal (g/L)")}
            {F("temp_c", "Temperatura (°C)")}
          </div>
        </div>

        <div>
          <Label>Observaciones</Label>
          <Textarea
            rows={4}
            value={form.observaciones}
            onChange={(e) => setForm({ ...form, observaciones: e.target.value })}
            placeholder="Productos aplicados, incidencias..."
          />
        </div>

        <Button type="submit" className="w-full" size="lg" disabled={submitting}>
          {submitting ? "Guardando..." : "Guardar parte"}
        </Button>
      </form>
    </div>
  );
}
