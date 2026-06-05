import { createFileRoute, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft } from "lucide-react";
import { getParte } from "@/lib/partes.functions";

export const Route = createFileRoute("/_authenticated/app/partes/$id")({
  component: ParteDetail,
});

function ParteDetail() {
  const { id } = Route.useParams();
  const fn = useServerFn(getParte);
  const { data, isLoading } = useQuery({ queryKey: ["parte", id], queryFn: () => fn({ data: { id } }) });

  if (isLoading) return <p className="text-sm text-muted-foreground">Cargando...</p>;
  if (!data) return null;
  const p: any = data.parte;
  const rows: [string, any][] = [
    ["pH", p.ph], ["Cloro libre", p.cloro_libre], ["Cloro total", p.cloro_total],
    ["Alcalinidad", p.alcalinidad], ["CYA", p.cya], ["Sal", p.sal], ["Temperatura", p.temp_c],
  ];

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
    </div>
  );
}
