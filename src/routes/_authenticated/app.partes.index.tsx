import { createFileRoute, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery } from "@tanstack/react-query";
import { Plus } from "lucide-react";
import { listPartes } from "@/lib/partes.functions";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/_authenticated/app/partes/")({
  component: PartesList,
});

function PartesList() {
  const fn = useServerFn(listPartes);
  const { data, isLoading } = useQuery({ queryKey: ["partes"], queryFn: () => fn() });

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h1 className="text-2xl font-semibold">Partes de trabajo</h1>
        <Link to="/app/partes/nuevo"><Button><Plus className="size-4 mr-2" /> Nuevo parte</Button></Link>
      </div>
      <div className="bg-card border border-border rounded-lg divide-y divide-border">
        {isLoading && <div className="p-8 text-center text-sm text-muted-foreground">Cargando...</div>}
        {data?.partes.map((p: any) => (
          <Link key={p.id} to="/app/partes/$id" params={{ id: p.id }} className="flex items-center justify-between p-4 hover:bg-muted/40">
            <div>
              <p className="font-medium">{p.piscinas?.alias ?? "—"} · {p.piscinas?.clientes?.nombre ?? ""}</p>
              <p className="text-xs text-muted-foreground">{new Date(p.fecha).toLocaleString("es-ES")} · {p.estado}</p>
            </div>
            <div className="text-sm text-muted-foreground">pH {p.ph ?? "—"} · Cl {p.cloro_libre ?? "—"}</div>
          </Link>
        ))}
        {!isLoading && (data?.partes.length ?? 0) === 0 && (
          <div className="p-8 text-center text-sm text-muted-foreground">
            Aún no hay partes. <Link to="/app/partes/nuevo" className="text-primary">Crea el primero</Link>.
          </div>
        )}
      </div>
    </div>
  );
}
