import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import {
  getOrgDetail,
  setOrgSuspended,
  inviteOrgOwner,
  impersonateOrg,
} from "@/lib/superadmin.functions";
import { SubscriptionEditor } from "@/components/superadmin/SubscriptionEditor";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import {
  ArrowLeft,
  UserPlus,
  LogIn,
  Power,
  AlertTriangle,
  Users,
  Building2,
  ClipboardList,
  MapPin,
} from "lucide-react";

export const Route = createFileRoute("/_authenticated/superadmin/orgs/$id")({
  component: AdminOrgDetail,
});

function AdminOrgDetail() {
  const { id } = Route.useParams();
  const navigate = useNavigate();
  const qc = useQueryClient();
  const getDetail = useServerFn(getOrgDetail);
  const setSuspended = useServerFn(setOrgSuspended);
  const invite = useServerFn(inviteOrgOwner);
  const impersonate = useServerFn(impersonateOrg);

  const { data, isLoading } = useQuery({
    queryKey: ["admin-org", id],
    queryFn: () => getDetail({ data: { id } }),
  });

  const [inviteOpen, setInviteOpen] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState<"owner" | "admin" | "tecnico">("admin");

  if (isLoading || !data) {
    return <p className="text-sm text-muted-foreground">Cargando…</p>;
  }

  const { org, members, clientes, partes, rutas } = data;


  async function handleSuspend() {
    const next = !org.suspended;
    if (!confirm(next ? "¿Suspender esta organización?" : "¿Reactivar esta organización?"))
      return;
    try {
      await setSuspended({ data: { id, suspended: next } });
      toast.success(next ? "Suspendida" : "Reactivada");
      qc.invalidateQueries({ queryKey: ["admin-org", id] });
      qc.invalidateQueries({ queryKey: ["admin-orgs"] });
    } catch (e: any) {
      toast.error(e?.message ?? "Error");
    }
  }

  async function handleInvite(e: React.FormEvent) {
    e.preventDefault();
    try {
      await invite({ data: { orgId: id, email: inviteEmail, role: inviteRole } });
      toast.success("Invitación creada");
      setInviteOpen(false);
      setInviteEmail("");
      qc.invalidateQueries({ queryKey: ["admin-org", id] });
    } catch (err: any) {
      toast.error(err?.message ?? "Error");
    }
  }

  async function handleImpersonate() {
    if (
      !confirm(
        `Vas a entrar en "${org.name}" como propietario. Quedarás añadido como miembro de esta organización. ¿Continuar?`,
      )
    )
      return;
    try {
      await impersonate({ data: { orgId: id } });
      toast.success("Has entrado en la organización");
      navigate({ to: "/app" });
    } catch (e: any) {
      toast.error(e?.message ?? "Error");
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <Link
          to="/superadmin/orgs"
          className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="size-4" /> Todas las organizaciones
        </Link>
      </div>

      <header className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2 className="font-display text-2xl flex items-center gap-2">
            <Building2 className="size-5 text-muted-foreground" />
            {org.name}
            {org.suspended && (
              <span className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded bg-destructive/10 text-destructive">
                <AlertTriangle className="size-3.5" /> Suspendida
              </span>
            )}
          </h2>
          <p className="text-xs text-muted-foreground mt-1">
            {org.slug} · creada {new Date(org.created_at).toLocaleDateString("es-ES")}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Dialog open={inviteOpen} onOpenChange={setInviteOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">
                <UserPlus className="size-4 mr-2" /> Invitar usuario
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Invitar a {org.name}</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleInvite} className="space-y-3">
                <div>
                  <Label>Email</Label>
                  <Input
                    required
                    type="email"
                    value={inviteEmail}
                    onChange={(e) => setInviteEmail(e.target.value)}
                  />
                </div>
                <div>
                  <Label>Rol</Label>
                  <Select value={inviteRole} onValueChange={(v) => setInviteRole(v as any)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="owner">Propietario</SelectItem>
                      <SelectItem value="admin">Admin</SelectItem>
                      <SelectItem value="tecnico">Técnico</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <DialogFooter>
                  <Button type="submit">Crear invitación</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>

          <Button variant="outline" size="sm" onClick={handleImpersonate}>
            <LogIn className="size-4 mr-2" /> Entrar como
          </Button>
          <Button
            variant={org.suspended ? "default" : "destructive"}
            size="sm"
            onClick={handleSuspend}
          >
            <Power className="size-4 mr-2" />
            {org.suspended ? "Reactivar" : "Suspender"}
          </Button>
        </div>
      </header>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <Stat icon={Users} label="Miembros" value={members.length} />
        <Stat icon={ClipboardList} label="Partes" value={partes.length} />
        <Stat icon={Building2} label="Clientes" value={clientes.length} />
      </div>

      {/* Suscripción */}
      <Section title="Suscripción">
        <SubscriptionEditor
          orgId={id}
          subscription={data.subscription}
          orgPlan={org.plan}
        />
      </Section>


      {/* Members */}
      <Section title="Miembros">
        <div className="bg-card border border-border rounded-lg divide-y divide-border">
          {members.map((m) => (
            <div
              key={m.user_id}
              className="flex items-center justify-between px-4 py-3 text-sm"
            >
              <div>
                <p className="font-medium">{m.email}</p>
                <p className="text-xs text-muted-foreground">
                  desde {new Date(m.created_at).toLocaleDateString("es-ES")}
                </p>
              </div>
              <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-muted text-xs font-medium capitalize">
                {m.role}
              </span>
            </div>
          ))}
          {members.length === 0 && (
            <p className="px-4 py-6 text-center text-sm text-muted-foreground">
              Sin miembros.
            </p>
          )}
        </div>
      </Section>

      {/* Clientes */}
      <Section title={`Clientes (${clientes.length})`}>
        <div className="bg-card border border-border rounded-lg divide-y divide-border max-h-96 overflow-auto">
          {clientes.map((c) => (
            <div key={c.id} className="px-4 py-2.5 text-sm">
              <p className="font-medium">{c.nombre}</p>
              <p className="text-xs text-muted-foreground">
                {c.email ?? c.telefono ?? "—"}
              </p>
            </div>
          ))}
          {clientes.length === 0 && (
            <p className="px-4 py-6 text-center text-sm text-muted-foreground">
              Sin clientes.
            </p>
          )}
        </div>
      </Section>

      {/* Rutas */}
      <Section title={`Rutas (${rutas.length})`}>
        <div className="bg-card border border-border rounded-lg divide-y divide-border">
          {rutas.map((r) => (
            <div key={r.id} className="px-4 py-2.5 text-sm flex items-center gap-2">
              <MapPin className="size-3.5 text-muted-foreground" />
              <span className="font-medium">{r.nombre}</span>
              <span className="ml-auto text-xs text-muted-foreground">
                {new Date(r.created_at).toLocaleDateString("es-ES")}
              </span>
            </div>
          ))}
          {rutas.length === 0 && (
            <p className="px-4 py-6 text-center text-sm text-muted-foreground">
              Sin rutas.
            </p>
          )}
        </div>
      </Section>

      {/* Partes recientes */}
      <Section title={`Partes recientes (${partes.length})`}>
        <div className="bg-card border border-border rounded-lg divide-y divide-border max-h-72 overflow-auto">
          {partes.slice(0, 25).map((p) => (
            <div
              key={p.id}
              className="px-4 py-2 text-xs flex items-center justify-between text-muted-foreground"
            >
              <span className="font-mono">{p.id.slice(0, 8)}</span>
              <span>{new Date(p.created_at).toLocaleString("es-ES")}</span>
            </div>
          ))}
          {partes.length === 0 && (
            <p className="px-4 py-6 text-center text-sm text-muted-foreground">
              Sin partes.
            </p>
          )}
        </div>
      </Section>
    </div>
  );
}

function Stat({
  icon: Icon,
  label,
  value,
}: {
  icon: any;
  label: string;
  value: number;
}) {
  return (
    <div className="rounded-xl border border-border/60 bg-surface p-4">
      <p className="text-xs uppercase text-muted-foreground mb-2 flex items-center gap-1.5">
        <Icon className="size-3.5" /> {label}
      </p>
      <p className="text-2xl font-display tabular-nums">{value}</p>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="space-y-2">
      <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
        {title}
      </h3>
      {children}
    </section>
  );
}

