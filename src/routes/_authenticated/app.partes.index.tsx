import { createFileRoute, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery } from "@tanstack/react-query";
import { Plus } from "lucide-react";
import { listPartes } from "@/lib/partes.functions";
import { Button } from "@/components/ui/button";
import { semaforoParte, dotClass, type Estado } from "@/lib/parte-ranges";

export const Route = createFileRoute("/_authenticated/app/partes/")({
  component: PartesList,
});

const tipoLabel: Record<string, string> = {
  rutina: "Rutina",
  periodico: "Periódico",
  inicial: "Inicial",
};

const estadoTitulo: Record<Estado, string> = {
  ok: "Todos los parámetros dentro de rango",
  alerta: "Algún parámetro en zona de alerta",
  critico: "Algún parámetro en zona de cierre obligatorio",
  neutro: "Sin parámetros registrados",
};

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
        {data?.partes.map((p: any) => {
          const estado = semaforoParte(p);
          return (
            <Link key={p.id} to="/app/partes/$id" params={{ id: p.id }} className="flex items-center gap-3 p-4 hover:bg-muted/40">
              <span
                className={`size-3 rounded-full shrink-0 ${dotClass[estado]}`}
                title={estadoTitulo[estado]}
                aria-label={estadoTitulo[estado]}
              />
              <div className="flex-1 min-w-0">
                <p className="font-medium truncate">{p.piscinas?.alias ?? "—"} · {p.piscinas?.clientes?.nombre ?? ""}</p>
                <p className="text-xs text-muted-foreground">
                  {new Date(p.fecha).toLocaleString("es-ES")} · {tipoLabel[p.tipo_control] ?? p.tipo_control}
                </p>
              </div>
              <div className="text-sm text-muted-foreground shrink-0">pH {p.ph ?? "—"} · Cl {p.cloro_libre ?? "—"}</div>
            </Link>
          );
        })}
        {!isLoading && (data?.partes.length ?? 0) === 0 && (
          <div className="p-8 text-center text-sm text-muted-foreground">
            Aún no hay partes. <Link to="/app/partes/nuevo" className="text-primary">Crea el primero</Link>.
          </div>
        )}
      </div>
    </div>
  );
}
