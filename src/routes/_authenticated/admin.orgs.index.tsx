import { createFileRoute, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery } from "@tanstack/react-query";
import { useState, useMemo } from "react";
import { listAllOrgs } from "@/lib/superadmin.functions";
import { Building2, Users, ClipboardList, AlertTriangle, Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";


export const Route = createFileRoute("/_authenticated/admin/orgs/")({
  component: AdminOrgsList,
});

function AdminOrgsList() {
  const fn = useServerFn(listAllOrgs);
  const { data, isLoading } = useQuery({
    queryKey: ["admin-orgs"],
    queryFn: () => fn(),
  });

  if (isLoading) {
    return <p className="text-sm text-muted-foreground">Cargando…</p>;
  }

  const orgs = data?.orgs ?? [];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-xl">Organizaciones ({orgs.length})</h2>
      </div>

      <div className="bg-card border border-border rounded-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-muted/40 text-xs uppercase text-muted-foreground">
            <tr>
              <th className="text-left px-4 py-3">Organización</th>
              <th className="text-left px-4 py-3">Plan</th>
              <th className="text-right px-4 py-3">Miembros</th>
              <th className="text-right px-4 py-3">Clientes</th>
              <th className="text-right px-4 py-3">Partes</th>
              <th className="text-left px-4 py-3">Última actividad</th>
              <th className="text-left px-4 py-3">Creada</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {orgs.map((o) => (
              <tr key={o.id} className="hover:bg-muted/30 transition">
                <td className="px-4 py-3">
                  <Link
                    to="/admin/orgs/$id"
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
                  <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-muted text-xs font-medium capitalize">
                    {o.plan ?? "free"}
                  </span>
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
              </tr>
            ))}
            {orgs.length === 0 && (
              <tr>
                <td colSpan={7} className="px-4 py-12 text-center text-muted-foreground">
                  No hay organizaciones todavía.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
