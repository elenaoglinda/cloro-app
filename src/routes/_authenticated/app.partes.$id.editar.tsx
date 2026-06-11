import { createFileRoute, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft } from "lucide-react";
import { getParte } from "@/lib/partes.functions";
import { ParteForm, type ParteFormInitial } from "./app.partes.nuevo";

export const Route = createFileRoute("/_authenticated/app/partes/$id/editar")({
  component: EditarParte,
});

function asStr(v: any): string {
  return v == null ? "" : String(v);
}

function EditarParte() {
  const { id } = Route.useParams();
  const fn = useServerFn(getParte);
  const { data, isLoading } = useQuery({ queryKey: ["parte", id], queryFn: () => fn({ data: { id } }) });

  if (isLoading) return <p className="text-sm text-muted-foreground p-4">Cargando...</p>;
  if (!data) return null;
  const p: any = data.parte;

  if (p.estado === "firmado") {
    return (
      <div className="max-w-2xl mx-auto space-y-4 p-4">
        <Link to="/app/partes/$id" params={{ id }} className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="size-4 mr-1" /> Volver
        </Link>
        <p className="text-sm">Este parte está firmado y no puede editarse.</p>
      </div>
    );
  }

  const d = new Date(p.fecha);
  const productosTexto =
    Array.isArray(p.productos_usados) && p.productos_usados.length > 0
      ? p.productos_usados.map((x: any) => x.texto ?? "").filter(Boolean).join("\n")
      : "";

  const initial: ParteFormInitial = {
    piscina_id: p.piscina_id,
    tipo_control: p.tipo_control,
    fecha: d.toISOString().slice(0, 10),
    hora_medicion: p.hora_medicion ? String(p.hora_medicion).slice(0, 5) : `${String(d.getHours()).padStart(2,"0")}:${String(d.getMinutes()).padStart(2,"0")}`,
    ph: asStr(p.ph),
    cloro_libre: asStr(p.cloro_libre),
    cloro_total: asStr(p.cloro_total),
    turbidez: asStr(p.turbidez),
    transparencia_fondo: p.transparencia_fondo == null ? "" : p.transparencia_fondo ? "si" : "no",
    temp_c: asStr(p.temp_c),
    redox: asStr(p.redox),
    tiempo_recirculacion: asStr(p.tiempo_recirculacion),
    cya: asStr(p.cya),
    alcalinidad: asStr(p.alcalinidad),
    sal: asStr(p.sal),
    ecoli: p.ecoli == null ? "" : p.ecoli ? "ok" : "ko",
    pseudomonas: p.pseudomonas == null ? "" : p.pseudomonas ? "ok" : "ko",
    bromo_total: asStr(p.bromo_total),
    observaciones: p.observaciones ?? "",
    productos_usados_texto: productosTexto,
  };

  return <ParteForm mode="edit" parteId={id} initial={initial} />;
}
