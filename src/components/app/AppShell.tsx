import { Link, Outlet, useNavigate, useRouterState } from "@tanstack/react-router";
import { Waves, Home, Users, Droplets, ClipboardList, Settings, LogOut } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";

const nav = [
  { to: "/app", label: "Inicio", icon: Home, exact: true },
  { to: "/app/clientes", label: "Clientes", icon: Users },
  { to: "/app/partes", label: "Partes", icon: ClipboardList },
  { to: "/app/piscinas", label: "Piscinas", icon: Droplets },
  { to: "/app/ajustes", label: "Ajustes", icon: Settings },
];

export function AppShell() {
  const navigate = useNavigate();
  const qc = useQueryClient();
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  async function signOut() {
    await qc.cancelQueries();
    qc.clear();
    await supabase.auth.signOut();
    navigate({ to: "/auth", replace: true });
  }

  const isActive = (to: string, exact?: boolean) =>
    exact ? pathname === to : pathname === to || pathname.startsWith(to + "/");

  return (
    <div className="min-h-screen flex bg-muted/20">
      {/* Sidebar (desktop) */}
      <aside className="hidden md:flex w-60 shrink-0 flex-col border-r border-border bg-card">
        <Link to="/app" className="flex items-center gap-2 px-6 h-16 border-b border-border">
          <span className="size-8 rounded-lg bg-gradient-pool flex items-center justify-center">
            <Waves className="size-4 text-primary-foreground" strokeWidth={2.5} />
          </span>
          <span className="font-display text-xl">Cloro</span>
        </Link>
        <nav className="flex-1 p-3 space-y-1">
          {nav.map((n) => {
            const Icon = n.icon;
            const active = isActive(n.to, n.exact);
            return (
              <Link
                key={n.to}
                to={n.to}
                className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm transition ${
                  active
                    ? "bg-primary/10 text-primary font-medium"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                <Icon className="size-4" />
                {n.label}
              </Link>
            );
          })}
        </nav>
        <div className="p-3 border-t border-border">
          <Button variant="ghost" size="sm" className="w-full justify-start" onClick={signOut}>
            <LogOut className="size-4 mr-2" /> Salir
          </Button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="md:hidden h-14 flex items-center justify-between px-4 border-b border-border bg-card">
          <Link to="/app" className="flex items-center gap-2">
            <span className="size-7 rounded-lg bg-gradient-pool flex items-center justify-center">
              <Waves className="size-3.5 text-primary-foreground" strokeWidth={2.5} />
            </span>
            <span className="font-display text-lg">Cloro</span>
          </Link>
          <Button variant="ghost" size="sm" onClick={signOut}>
            <LogOut className="size-4" />
          </Button>
        </header>
        <main className="flex-1 p-4 md:p-8 pb-24 md:pb-8 overflow-auto">
          <Outlet />
        </main>

        {/* Bottom nav (mobile) */}
        <nav className="md:hidden fixed bottom-0 inset-x-0 bg-card border-t border-border grid grid-cols-5 z-50">
          {nav.map((n) => {
            const Icon = n.icon;
            const active = isActive(n.to, n.exact);
            return (
              <Link
                key={n.to}
                to={n.to}
                className={`flex flex-col items-center justify-center gap-1 py-2 text-[11px] ${
                  active ? "text-primary" : "text-muted-foreground"
                }`}
              >
                <Icon className="size-5" />
                {n.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
