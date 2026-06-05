import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { getMyContext } from "@/lib/orgs.functions";
import { listInvites, createInvite, revokeInvite } from "@/lib/invites.functions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Trash2 } from "lucide-react";

export const Route = createFileRoute("/_authenticated/app/ajustes")({
  component: Ajustes,
});

function Ajustes() {
  const qc = useQueryClient();
  const ctxFn = useServerFn(getMyContext);
  const listFn = useServerFn(listInvites);
  const createFn = useServerFn(createInvite);
  const revokeFn = useServerFn(revokeInvite);

  const { data: ctx } = useQuery({ queryKey: ["ctx"], queryFn: () => ctxFn() });
  const { data: team } = useQuery({ queryKey: ["invites"], queryFn: () => listFn() });

  const [email, setEmail] = useState("");
  const [role, setRole] = useState<"admin" | "tecnico">("tecnico");
  const [busy, setBusy] = useState(false);

  async function invite(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    try {
      const res = await createFn({ data: { email: email.trim(), role } });
      const link = `${window.location.origin}/invitacion/${res.token}`;
      await navigator.clipboard.writeText(link).catch(() => {});
      toast.success("Invitación creada. Enlace copiado al portapapeles.");
      setEmail("");
      qc.invalidateQueries({ queryKey: ["invites"] });
    } catch (err: any) {
      toast.error(err.message || "Error");
    } finally {
      setBusy(false);
    }
  }

  async function revoke(id: string) {
    await revokeFn({ data: { id } });
    qc.invalidateQueries({ queryKey: ["invites"] });
  }

  async function copyLink(token: string) {
    const link = `${window.location.origin}/invitacion/${token}`;
    await navigator.clipboard.writeText(link);
    toast.success("Enlace copiado");
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <h1 className="text-2xl font-semibold">Ajustes</h1>
      <div className="bg-card border border-border rounded-lg p-5 space-y-2">
        <h2 className="text-sm font-semibold">Tu cuenta</h2>
        <Row label="Nombre" value={ctx?.profile?.full_name ?? "—"} />
        <Row label="Organización" value={ctx?.currentOrg?.name ?? "—"} />
        <Row label="Plan" value={ctx?.currentOrg?.plan ?? "—"} />
      </div>

      <div className="bg-card border border-border rounded-lg p-5">
        <h2 className="text-sm font-semibold mb-3">Invitar al equipo</h2>
        <form onSubmit={invite} className="flex flex-col sm:flex-row gap-2">
          <Input type="email" required placeholder="email@empresa.com" value={email} onChange={(e) => setEmail(e.target.value)} />
          <select
            value={role}
            onChange={(e) => setRole(e.target.value as any)}
            className="h-10 rounded-md border border-input bg-background px-3 text-sm"
          >
            <option value="tecnico">Técnico</option>
            <option value="admin">Admin</option>
          </select>
          <Button type="submit" disabled={busy}>{busy ? "..." : "Invitar"}</Button>
        </form>
      </div>

      <div className="bg-card border border-border rounded-lg p-5">
        <h2 className="text-sm font-semibold mb-3">Invitaciones</h2>
        {!team?.invites.length ? (
          <p className="text-sm text-muted-foreground">Sin invitaciones aún.</p>
        ) : (
          <ul className="divide-y divide-border/60">
            {team.invites.map((i: any) => (
              <li key={i.id} className="flex items-center justify-between py-2 text-sm">
                <div>
                  <div className="font-medium">{i.email}</div>
                  <div className="text-xs text-muted-foreground">
                    {i.role} · {i.accepted_at ? "Aceptada" : "Pendiente"}
                  </div>
                </div>
                <div className="flex gap-2">
                  {!i.accepted_at && (
                    <Button size="sm" variant="outline" onClick={() => copyLink(i.token)}>Copiar enlace</Button>
                  )}
                  <Button size="sm" variant="ghost" onClick={() => revoke(i.id)}>
                    <Trash2 className="size-4" />
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        )}
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
