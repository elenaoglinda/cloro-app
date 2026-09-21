import { createFileRoute, Link, Outlet, useRouterState } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Shield, Building2, MessageSquare, KeyRound } from "lucide-react";
import { checkSuperAdmin, bootstrapSuperAdmin } from "@/lib/superadmin.functions";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/admin")({
  head: () => ({
    meta: [
      { title: "Super Admin — Cloro" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: AdminLayout,
});

function AdminLayout() {
  const check = useServerFn(checkSuperAdmin);
  const bootstrap = useServerFn(bootstrapSuperAdmin);
  const qc = useQueryClient();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [pwd, setPwd] = useState("");
  const [busy, setBusy] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ["super-admin-check"],
    queryFn: () => check(),
  });

  async function doBootstrap(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    try {
      await bootstrap({ data: { password: pwd } });
      toast.success("Acceso concedido");
      qc.invalidateQueries({ queryKey: ["super-admin-check"] });
    } catch (err: any) {
      toast.error(err?.message ?? "Error");
    } finally {
      setBusy(false);
    }
  }

  if (isLoading) {
    return (
      <main className="max-w-md mx-auto px-6 py-24 text-sm text-muted-foreground">
        Comprobando acceso…
      </main>
    );
  }

  if (!data?.isSuperAdmin) {
    return (
      <main className="max-w-md mx-auto px-6 py-24">
        <div className="rounded-2xl border border-border/60 bg-surface p-8">
          <div className="size-10 rounded-lg bg-gradient-pool flex items-center justify-center mb-4">
            <KeyRound className="size-5 text-primary-foreground" />
          </div>
          <h1 className="font-display text-2xl">Acceso super-admin</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Introduce la contraseña maestra para activar tu rol de super-administrador
            en esta cuenta.
          </p>
          <form onSubmit={doBootstrap} className="mt-6 space-y-3">
            <input
              type="password"
              value={pwd}
              onChange={(e) => setPwd(e.target.value)}
              placeholder="Contraseña maestra"
              autoFocus
              className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
            />
            <button
              type="submit"
              disabled={busy || !pwd}
              className="w-full inline-flex items-center justify-center h-10 px-4 rounded-md bg-foreground text-background text-sm font-medium hover:opacity-90 transition disabled:opacity-60"
            >
              {busy ? "Activando…" : "Activar"}
            </button>
          </form>
        </div>
      </main>
    );
  }

  const tabs = [
    { to: "/admin/orgs", label: "Organizaciones", icon: Building2 },
    { to: "/admin/mensajes", label: "Mensajes", icon: MessageSquare },
  ];

  return (
    <main className="max-w-7xl mx-auto px-6 py-10">
      <header className="flex items-center gap-3 mb-6">
        <span className="size-9 rounded-lg bg-gradient-pool flex items-center justify-center">
          <Shield className="size-4 text-primary-foreground" strokeWidth={2.5} />
        </span>
        <div>
          <h1 className="font-display text-2xl leading-none">Super Admin</h1>
          <p className="text-xs text-muted-foreground mt-1">Panel maestro de Cloro</p>
        </div>
      </header>

      <nav className="flex gap-1 border-b border-border mb-8">
        {tabs.map((t) => {
          const Icon = t.icon;
          const active = pathname === t.to || pathname.startsWith(t.to + "/");
          return (
            <Link
              key={t.to}
              to={t.to}
              className={`inline-flex items-center gap-2 px-4 py-2.5 text-sm border-b-2 -mb-px transition ${
                active
                  ? "border-primary text-foreground font-medium"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              <Icon className="size-4" />
              {t.label}
            </Link>
          );
        })}
      </nav>

      <Outlet />
    </main>
  );
}
