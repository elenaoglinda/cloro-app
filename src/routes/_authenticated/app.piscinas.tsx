import { createFileRoute, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery } from "@tanstack/react-query";
import { Droplets } from "lucide-react";
import { listPiscinas } from "@/lib/piscinas.functions";

export const Route = createFileRoute("/_authenticated/app/piscinas")({
  component: PiscinasList,
});

function PiscinasList() {
  const fn = useServerFn(listPiscinas);
  const { data, isLoading } = useQuery({ queryKey: ["piscinas"], queryFn: () => fn() });

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <h1 className="text-2xl font-semibold">Piscinas</h1>
      <div className="bg-card border border-border rounded-lg divide-y divide-border">
        {isLoading && <div className="p-8 text-center text-sm text-muted-foreground">Cargando...</div>}
        {data?.piscinas.map((p: any) => (
          <div key={p.id} className="p-4 flex items-center gap-3">
            <Droplets className="size-4 text-primary" />
            <div>
              <p className="font-medium">{p.alias}</p>
              <p className="text-xs text-muted-foreground">{p.clientes?.nombre ?? "—"}</p>
            </div>
          </div>
        ))}
        {!isLoading && (data?.piscinas.length ?? 0) === 0 && (
          <div className="p-8 text-center text-sm text-muted-foreground">
            Aún no hay piscinas. Añádelas desde la ficha de un <Link to="/app/clientes" className="text-primary">cliente</Link>.
          </div>
        )}
      </div>
    </div>
  );
}
