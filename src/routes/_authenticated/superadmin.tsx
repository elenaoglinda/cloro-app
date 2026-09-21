import {
  createFileRoute,
  Link,
  Outlet,
  redirect,
  useRouterState,
  isRedirect,
} from "@tanstack/react-router";
import { Shield, Building2, MessageSquare } from "lucide-react";
import { checkSuperAdmin } from "@/lib/superadmin.functions";

export const Route = createFileRoute("/_authenticated/superadmin")({
  head: () => ({
    meta: [
      { title: "Super Admin — Cloro" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  beforeLoad: async () => {
    try {
      const { isSuperAdmin } = await checkSuperAdmin();
      if (!isSuperAdmin) throw redirect({ to: "/app" });
    } catch (e) {
      if (isRedirect(e)) throw e;
      throw redirect({ to: "/app" });
    }
  },
  component: AdminLayout,
});

function AdminLayout() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  const tabs = [
    { to: "/superadmin/orgs", label: "Organizaciones", icon: Building2 },
    { to: "/superadmin/mensajes", label: "Mensajes", icon: MessageSquare },
  ];

  return (
    <main className="max-w-7xl mx-auto px-6 py-10">
      <header className="flex items-center gap-3 mb-6">
        <span className="size-9 rounded-lg bg-gradient-pool flex items-center justify-center">
          <Shield
            className="size-4 text-primary-foreground"
            strokeWidth={2.5}
          />
        </span>
        <div>
          <h1 className="font-display text-2xl leading-none">Super Admin</h1>
          <p className="text-xs text-muted-foreground mt-1">
            Panel maestro de Cloro
          </p>
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
