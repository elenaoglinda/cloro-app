import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery } from "@tanstack/react-query";
import { getMyContext } from "@/lib/orgs.functions";

export const Route = createFileRoute("/_authenticated/app/ajustes")({
  component: Ajustes,
});

function Ajustes() {
  const fn = useServerFn(getMyContext);
  const { data } = useQuery({ queryKey: ["ctx"], queryFn: () => fn() });

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <h1 className="text-2xl font-semibold">Ajustes</h1>
      <div className="bg-card border border-border rounded-lg p-5 space-y-3">
        <h2 className="text-sm font-semibold">Tu cuenta</h2>
        <Row label="Nombre" value={data?.profile?.full_name ?? "—"} />
        <Row label="Organización" value={data?.currentOrg?.name ?? "—"} />
        <Row label="Plan" value={data?.currentOrg?.plan ?? "—"} />
      </div>
      <div className="bg-card border border-border rounded-lg p-5">
        <h2 className="text-sm font-semibold mb-2">Equipo (próximamente)</h2>
        <p className="text-sm text-muted-foreground">
          Invita técnicos a tu organización. Disponible en la próxima versión.
        </p>
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between text-sm border-b border-border/60 py-2">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium">{value}</span>
    </div>
  );
}
