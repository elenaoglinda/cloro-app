import { createFileRoute, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery } from "@tanstack/react-query";
import { useState, useMemo } from "react";
import { listAllOrgs } from "@/lib/superadmin.functions";
import { SubscriptionEditor } from "@/components/superadmin/SubscriptionEditor";
import { Building2, Users, ClipboardList, AlertTriangle, Search, X, CircleCheck, Clock, Ban } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";


export const Route = createFileRoute("/_authenticated/superadmin/orgs/")({
  component: AdminOrgsList,
});

const PLANS = ["all", "free", "starter", "pro", "enterprise"] as const;
const STATUSES = [
  "all",
  "active",
  "trialing",
  "past_due",
  "cancelled",
  "suspended",
] as const;

type OrgRow = {
  id: string;
  name: string;
  slug: string;
  plan: string;
  suspended: boolean;
  created_at: string;
  members: number;
  clientes: number;
  partes: number;
  last_activity: string | null;
  subscription_status: string | null;
  trial_ends_at: string | null;
  notes: string | null;
  owner_name: string | null;
  owner_email: string | null;
};


function AdminOrgsList() {
  const fn = useServerFn(listAllOrgs);
  const { data, isLoading } = useQuery({
    queryKey: ["admin-orgs"],
    queryFn: () => fn(),
  });

  const [search, setSearch] = useState("");
  const [planFilter, setPlanFilter] = useState<(typeof PLANS)[number]>("all");
  const [statusFilter, setStatusFilter] = useState<(typeof STATUSES)[number]>("all");

  const allOrgs = (data?.orgs ?? []) as OrgRow[];

  const filteredOrgs = useMemo(() => {
    const q = search.trim().toLowerCase();
    return allOrgs.filter((o) => {
      const matchesSearch =
        !q ||
        o.name.toLowerCase().includes(q) ||
        o.slug.toLowerCase().includes(q);
      const matchesPlan = planFilter === "all" || o.plan === planFilter;
      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "suspended"
          ? o.suspended
          : !o.suspended && (o.subscription_status ?? "trialing") === statusFilter);
      return matchesSearch && matchesPlan && matchesStatus;
    });
  }, [allOrgs, search, planFilter, statusFilter]);

  const summary = useMemo(() => {
    return {
      total: allOrgs.length,
      active: allOrgs.filter(
        (o) => !o.suspended && o.subscription_status === "active",
      ).length,
      trialing: allOrgs.filter(
        (o) => !o.suspended && o.subscription_status === "trialing",
      ).length,
      cancelled: allOrgs.filter((o) => o.subscription_status === "cancelled")
        .length,
    };
  }, [allOrgs]);

  const activeFilters =
    search !== "" || planFilter !== "all" || statusFilter !== "all";

  function clearFilters() {
    setSearch("");
    setPlanFilter("all");
    setStatusFilter("all");
  }

  if (isLoading) {
    return <p className="text-sm text-muted-foreground">Cargando…</p>;
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <h2 className="font-display text-xl">Organizaciones ({filteredOrgs.length})</h2>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <SummaryCard
          label="Total organizaciones"
          value={summary.total}
          icon={Building2}
          tone="neutral"
        />
        <SummaryCard
          label="Activas"
          value={summary.active}
          icon={CircleCheck}
          tone="success"
        />
        <SummaryCard
          label="En prueba"
          value={summary.trialing}
          icon={Clock}
          tone="warning"
        />
        <SummaryCard
          label="Canceladas"
          value={summary.cancelled}
          icon={Ban}
          tone="danger"
        />
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por nombre o slug…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={planFilter} onValueChange={(v) => setPlanFilter(v as any)}>
          <SelectTrigger className="w-full sm:w-40">
            <SelectValue placeholder="Plan" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos los planes</SelectItem>
            <SelectItem value="free">Free</SelectItem>
            <SelectItem value="starter">Starter</SelectItem>
            <SelectItem value="pro">Pro</SelectItem>
            <SelectItem value="enterprise">Enterprise</SelectItem>
          </SelectContent>
        </Select>
        <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as any)}>
          <SelectTrigger className="w-full sm:w-40">
            <SelectValue placeholder="Estado" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos los estados</SelectItem>
            <SelectItem value="active">Activas</SelectItem>
            <SelectItem value="trialing">En prueba</SelectItem>
            <SelectItem value="past_due">Pago pendiente</SelectItem>
            <SelectItem value="cancelled">Canceladas</SelectItem>
            <SelectItem value="suspended">Suspendidas</SelectItem>
          </SelectContent>
        </Select>
        {activeFilters && (
          <button
            onClick={clearFilters}
            className="inline-flex items-center justify-center gap-1.5 text-sm text-muted-foreground hover:text-foreground px-2 py-2 rounded-md hover:bg-muted transition"
            type="button"
          >
            <X className="size-4" /> Limpiar
          </button>
        )}
      </div>


      <div className="bg-card border border-border rounded-lg overflow-x-auto">
        <table className="w-full min-w-[1100px] text-sm">
          <thead className="bg-muted/40 text-xs uppercase text-muted-foreground">
            <tr>
              <th className="text-left px-4 py-3">Organización</th>
              <th className="text-left px-4 py-3">Propietario</th>
              <th className="text-left px-4 py-3">Plan</th>
              <th className="text-left px-4 py-3">Estado</th>
              <th className="text-left px-4 py-3">Fin de prueba</th>
              <th className="text-right px-4 py-3">Miembros</th>
              <th className="text-right px-4 py-3">Clientes</th>
              <th className="text-right px-4 py-3">Partes</th>
              <th className="text-left px-4 py-3">Última actividad</th>
              <th className="text-left px-4 py-3">Creada</th>
              <th className="text-left px-4 py-3">Notas</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {filteredOrgs.map((o) => (
              <tr key={o.id} className="hover:bg-muted/30 transition align-top">
                <td className="px-4 py-3">
                  <Link
                    to="/superadmin/orgs/$id"
                    params={{ id: o.id }}
                    className="flex items-center gap-2 font-medium hover:text-primary"
                  >
                    <Building2 className="size-4 text-muted-foreground" />
                    <span>{o.name}</span>
                    {o.suspended && (
                      <span className="inline-flex items-center gap-1 text-[10px] uppercase tracking-wide px-1.5 py-0.5 rounded bg-destructive/10 text-destructive">
                        <AlertTriangle className="size-3" /> Suspendida
                      </span>
                    )}
                  </Link>
                  <p className="text-xs text-muted-foreground mt-0.5">{o.slug}</p>
                </td>
                <td className="px-4 py-3">
                  <p className="font-medium">{o.owner_name ?? "—"}</p>
                  <p className="text-xs text-muted-foreground">{o.owner_email ?? "—"}</p>
                </td>
                <td className="px-4 py-3">
                  <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-muted text-xs font-medium capitalize">
                    {o.plan ?? "free"}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <StatusBadge status={o.subscription_status} />
                </td>
                <td className="px-4 py-3 text-xs text-muted-foreground">
                  {o.trial_ends_at
                    ? new Date(o.trial_ends_at).toLocaleDateString("es-ES")
                    : "—"}
                </td>
                <td className="px-4 py-3 text-right tabular-nums">
                  <span className="inline-flex items-center gap-1 text-muted-foreground">
                    <Users className="size-3.5" /> {o.members}
                  </span>
                </td>
                <td className="px-4 py-3 text-right tabular-nums text-muted-foreground">
                  {o.clientes}
                </td>
                <td className="px-4 py-3 text-right tabular-nums text-muted-foreground">
                  <span className="inline-flex items-center gap-1">
                    <ClipboardList className="size-3.5" /> {o.partes}
                  </span>
                </td>
                <td className="px-4 py-3 text-xs text-muted-foreground">
                  {o.last_activity
                    ? new Date(o.last_activity).toLocaleDateString("es-ES")
                    : "—"}
                </td>
                <td className="px-4 py-3 text-xs text-muted-foreground">
                  {new Date(o.created_at).toLocaleDateString("es-ES")}
                </td>
                <td className="px-4 py-3 text-xs text-muted-foreground max-w-[220px]">
                  {o.notes ? (
                    <span className="line-clamp-2" title={o.notes}>
                      {o.notes}
                    </span>
                  ) : (
                    "—"
                  )}
                </td>
              </tr>
            ))}
            {filteredOrgs.length === 0 && (
              <tr>
                <td colSpan={11} className="px-4 py-12 text-center text-muted-foreground">
                  {activeFilters
                    ? "Ninguna organización coincide con los filtros."
                    : "No hay organizaciones todavía."}
                </td>
              </tr>
            )}
          </tbody>

        </table>
      </div>
    </div>
  );
}

const SUMMARY_STYLES: Record<
  SummaryTone,
  { iconCls: string; valueCls: string }
> = {
  neutral: {
    iconCls: "bg-muted text-foreground",
    valueCls: "text-foreground",
  },
  success: {
    iconCls: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
    valueCls: "text-emerald-600 dark:text-emerald-400",
  },
  warning: {
    iconCls: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
    valueCls: "text-amber-600 dark:text-amber-400",
  },
  danger: {
    iconCls: "bg-destructive/10 text-destructive",
    valueCls: "text-destructive",
  },
};

type SummaryTone = "neutral" | "success" | "warning" | "danger";

function SummaryCard({
  label,
  value,
  icon: Icon,
  tone,
}: {
  label: string;
  value: number;
  icon: React.ComponentType<{ className?: string }>;
  tone: SummaryTone;
}) {
  const styles = SUMMARY_STYLES[tone];
  return (
    <div className="bg-card border border-border rounded-lg p-4 flex items-center gap-4">
      <div
        className={`inline-flex items-center justify-center size-10 rounded-full ${styles.iconCls}`}
      >
        <Icon className="size-5" />
      </div>
      <div>
        <p className={`text-2xl font-display font-semibold tabular-nums ${styles.valueCls}`}>
          {value}
        </p>
        <p className="text-xs text-muted-foreground">{label}</p>
      </div>
    </div>
  );
}

const STATUS_STYLES: Record<string, { label: string; cls: string }> = {
  active: {
    label: "Activa",
    cls: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30",
  },
  trialing: {
    label: "En prueba",
    cls: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30",
  },
  past_due: {
    label: "Pago pendiente",
    cls: "bg-destructive/10 text-destructive border-destructive/30",
  },
  cancelled: {
    label: "Cancelada",
    cls: "bg-destructive/10 text-destructive border-destructive/30",
  },
};

function StatusBadge({ status }: { status: string | null }) {
  const s = STATUS_STYLES[status ?? ""] ?? {
    label: status ?? "—",
    cls: "bg-muted text-muted-foreground border-border",
  };
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full border text-xs font-medium ${s.cls}`}
    >
      <span className="size-1.5 rounded-full bg-current" />
      {s.label}
    </span>
  );
}

