import { Link } from "@tanstack/react-router";
import { Waves } from "lucide-react";

export function SiteNav() {
  return (
    <header className="sticky top-0 z-50 backdrop-blur-md bg-background/75 border-b border-border/60">
      <nav className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group">
          <span className="size-8 rounded-lg bg-gradient-pool flex items-center justify-center shadow-soft">
            <Waves className="size-4 text-primary-foreground" strokeWidth={2.5} />
          </span>
          <span className="font-display text-2xl tracking-tight">Flipper</span>
        </Link>
        <div className="hidden md:flex items-center gap-8 text-sm text-muted-foreground">
          <a href="/#caracteristicas" className="hover:text-foreground transition">Características</a>
          <a href="/#whatsapp" className="hover:text-foreground transition">Agente WhatsApp</a>
          <a href="/#cumplimiento" className="hover:text-foreground transition">SILOÉ</a>
          <a href="/#comparativa" className="hover:text-foreground transition">Comparativa</a>
          <a href="/#precios" className="hover:text-foreground transition">Precios</a>
        </div>
        <div className="flex items-center gap-3">
          <a href="/#precios" className="hidden sm:inline text-sm text-muted-foreground hover:text-foreground transition">Iniciar sesión</a>
          <a href="/#cta" className="inline-flex items-center justify-center h-9 px-4 rounded-md bg-foreground text-background text-sm font-medium hover:opacity-90 transition shadow-soft">
            Prueba gratis
          </a>
        </div>
      </nav>
    </header>
  );
}
