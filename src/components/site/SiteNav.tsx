import { Link } from "@tanstack/react-router";
import { Menu, Waves, X } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";

export function SiteNav() {
  const [menuOpen, setMenuOpen] = useState(false);
  return (
    <header className="sticky top-0 z-50 backdrop-blur-md bg-background/75 border-b border-border/60">
      <nav className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group">
          <span className="size-8 rounded-lg bg-gradient-pool flex items-center justify-center shadow-soft">
            <Waves className="size-4 text-primary-foreground" strokeWidth={2.5} />
          </span>
          <span className="font-display text-2xl tracking-tight">Cloro</span>
        </Link>
        <div className="hidden xl:flex items-center gap-5 text-sm text-muted-foreground">
          <a href="/#caracteristicas" className="hover:text-foreground transition">Características</a>
          <a href="/#whatsapp" className="hover:text-foreground transition">Agente WhatsApp</a>
          <a href="/#cumplimiento" className="hover:text-foreground transition">SILOÉ</a>
          <a href="/#verifactu" className="hover:text-foreground transition">VeriFactu</a>
          <a href="/#comparativa" className="hover:text-foreground transition">Comparativa</a>
          <a href="/#precios" className="hover:text-foreground transition">Precios</a>
          <Link to="/preguntas-frecuentes" className="hover:text-foreground transition">FAQ</Link>
          <Link to="/blog" className="hover:text-foreground transition">Blog</Link>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" className="xl:hidden" aria-label={menuOpen ? "Cerrar menú" : "Abrir menú"} aria-expanded={menuOpen} aria-controls="site-menu" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <X /> : <Menu />}
          </Button>
          <a href="https://panel.cloro.app/login" className="hidden sm:inline text-sm text-muted-foreground hover:text-foreground transition">Iniciar sesión</a>
          <a href="https://panel.cloro.app/signup" className="inline-flex items-center justify-center h-9 px-4 rounded-md bg-foreground text-background text-sm font-medium hover:opacity-90 transition shadow-soft">
            Prueba gratis
          </a>
        </div>
      </nav>
      {menuOpen && (
        <nav id="site-menu" aria-label="Menú principal" className="xl:hidden border-t border-border bg-background px-6 py-4 grid grid-cols-2 gap-4 text-sm">
          {[
            ["Características", "/#caracteristicas"],
            ["Agente WhatsApp", "/#whatsapp"],
            ["SILOÉ", "/#cumplimiento"],
            ["VeriFactu", "/#verifactu"],
            ["Comparativa", "/#comparativa"],
            ["Precios", "/#precios"],
            ["FAQ", "/preguntas-frecuentes"],
            ["Blog", "/blog"],
          ].map(([label, href]) => (
            <a key={href} href={href} onClick={() => setMenuOpen(false)} className="text-muted-foreground hover:text-foreground">{label}</a>
          ))}
        </nav>
      )}
    </header>
  );
}
