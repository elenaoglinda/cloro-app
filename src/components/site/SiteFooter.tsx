import { Waves } from "lucide-react";

export function SiteFooter() {
  return (
    <footer className="border-t border-border/60 bg-surface mt-24">
      <div className="max-w-7xl mx-auto px-6 py-14 grid gap-10 md:grid-cols-5">
        <div className="md:col-span-2">
          <div className="flex items-center gap-2">
            <span className="size-8 rounded-lg bg-gradient-pool flex items-center justify-center">
              <Waves className="size-4 text-primary-foreground" strokeWidth={2.5} />
            </span>
            <span className="font-display text-2xl">Cloro</span>
          </div>
          <p className="mt-4 text-sm text-muted-foreground max-w-sm">
            El sistema operativo para empresas de mantenimiento de piscinas en España.
            Rutas, química, facturación, SILOÉ y WhatsApp en una sola plataforma.
          </p>
        </div>
        <div>
          <h4 className="text-sm font-medium mb-3">Producto</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><a href="/#caracteristicas" className="hover:text-foreground">Características</a></li>
            <li><a href="/#whatsapp" className="hover:text-foreground">Agente WhatsApp</a></li>
            <li><a href="/#cumplimiento" className="hover:text-foreground">Cumplimiento SILOÉ</a></li>
            <li><a href="/#precios" className="hover:text-foreground">Precios</a></li>
            <li><Link to="/preguntas-frecuentes" className="hover:text-foreground">FAQ</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="text-sm font-medium mb-3">Comparativas</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><a href="/comparativa/autocontrolpiscinas" className="hover:text-foreground">vs AutocontrolPiscinas</a></li>
            <li><a href="/comparativa/evisane" className="hover:text-foreground">vs EviSane</a></li>
            <li><a href="/comparativa/eisi-hotel" className="hover:text-foreground">vs EISI Hotel</a></li>
          </ul>
        </div>
        <div>
          <h4 className="text-sm font-medium mb-3">Empresa</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><a href="/contacto" className="hover:text-foreground">Contacto</a></li>
            <li><a href="mailto:hola@cloro.app" className="hover:text-foreground">hola@cloro.app</a></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-border/60">
        <div className="max-w-7xl mx-auto px-6 py-5 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-muted-foreground">
          <p>© {new Date().getFullYear()} Cloro. Hecho en España. Datos alojados en la UE.</p>
          <p>RD 742/2013 · SILOÉ · VeriFactu · Bizum · SEPA</p>
        </div>
      </div>
    </footer>
  );
}
