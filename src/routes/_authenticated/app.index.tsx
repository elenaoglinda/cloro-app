import { createFileRoute, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery } from "@tanstack/react-query";
import { Users, ClipboardList, Droplets, Plus } from "lucide-react";
import { getMyContext } from "@/lib/orgs.functions";
import { listClientes } from "@/lib/clientes.functions";
import { listPartes } from "@/lib/partes.functions";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/_authenticated/app/")({
  component: Dashboard,
});

function Dashboard() {
  const ctxFn = useServerFn(getMyContext);
  const clientesFn = useServerFn(listClientes);
  const partesFn = useServerFn(listPartes);

  const ctx = useQuery({ queryKey: ["ctx"], queryFn: () => ctxFn() });
  const clientes = useQuery({ queryKey: ["clientes"], queryFn: () => clientesFn({ data: {} }) });
  const partes = useQuery({ queryKey: ["partes"], queryFn: () => partesFn() });

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div className="flex items-end justify-between flex-wrap gap-3">
        <div>
          <p className="text-sm text-muted-foreground">
            {ctx.data?.currentOrg?.name ?? "Tu organización"}
          </p>
          <h1 className="text-2xl md:text-3xl font-semibold tracking-tight">
            Hola{ctx.data?.profile?.full_name ? `, ${ctx.data.profile.full_name.split(" ")[0]}` : ""} 👋
          </h1>
        </div>
        <Link to="/app/partes/nuevo">
          <Button><Plus className="size-4 mr-2" /> Nuevo parte</Button>
        </Link>
      </div>

      <div className="grid sm:grid-cols-3 gap-4">
        <StatCard icon={Users} label="Clientes" value={clientes.data?.clientes.length ?? 0} to="/app/clientes" />
        <StatCard icon={ClipboardList} label="Partes" value={partes.data?.partes.length ?? 0} to="/app/partes" />
        <StatCard icon={Droplets} label="Piscinas activas" value={"—"} to="/app/piscinas" />
      </div>

      <section>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold">Partes recientes</h2>
          <Link to="/app/partes" className="text-sm text-primary">Ver todos</Link>
        </div>
        <div className="bg-card border border-border rounded-lg divide-y divide-border">
          {partes.data?.partes.slice(0, 5).map((p: any) => (
            <Link key={p.id} to="/app/partes/$id" params={{ id: p.id }} className="flex items-center justify-between p-4 hover:bg-muted/40">
              <div>
                <p className="font-medium">{p.piscinas?.alias ?? "Piscina"} · {p.piscinas?.clientes?.nombre ?? ""}</p>
                <p className="text-xs text-muted-foreground">{new Date(p.fecha).toLocaleString("es-ES")}</p>
              </div>
              <div className="text-sm text-muted-foreground">
                pH {p.ph ?? "—"} · Cl {p.cloro_libre ?? "—"}
              </div>
            </Link>
          ))}
          {!partes.isLoading && (partes.data?.partes.length ?? 0) === 0 && (
            <div className="p-8 text-center text-sm text-muted-foreground">
              Aún no hay partes. <Link to="/app/partes/nuevo" className="text-primary">Crea el primero</Link>.
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

function StatCard({ icon: Icon, label, value, to }: any) {
  return (
    <Link to={to} className="bg-card border border-border rounded-lg p-5 hover:border-primary/40 transition">
      <Icon className="size-5 text-primary mb-3" />
      <p className="text-2xl font-semibold">{value}</p>
      <p className="text-sm text-muted-foreground">{label}</p>
    </Link>
  );
}
