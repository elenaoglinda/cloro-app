import { Check, X, ArrowRight, Minus } from "lucide-react";
import { SiteNav } from "@/components/site/SiteNav";
import { SiteFooter } from "@/components/site/SiteFooter";

export type CellValue = boolean | "partial" | string;

export interface ComparisonRow {
  feature: string;
  detail?: string;
  cloro: CellValue;
  competitor: CellValue;
}

export interface ComparisonSection {
  title: string;
  rows: ComparisonRow[];
}

export interface ComparisonPageProps {
  competitorName: string;
  competitorTagline: string;
  intro: string;
  summary: string[];
  sections: ComparisonSection[];
  verdict: string;
  bestFor: { cloro: string; competitor: string };
}

function Cell({ value }: { value: CellValue }) {
  if (value === true) {
    return (
      <span className="inline-flex items-center gap-1.5 text-sm text-foreground">
        <Check className="size-4 text-primary" strokeWidth={2.5} />
        Sí
      </span>
    );
  }
  if (value === false) {
    return (
      <span className="inline-flex items-center gap-1.5 text-sm text-muted-foreground">
        <X className="size-4 text-muted-foreground/70" strokeWidth={2.5} />
        No
      </span>
    );
  }
  if (value === "partial") {
    return (
      <span className="inline-flex items-center gap-1.5 text-sm text-muted-foreground">
        <Minus className="size-4" strokeWidth={2.5} />
        Parcial
      </span>
    );
  }
  return <span className="text-sm text-foreground">{value}</span>;
}

export function ComparisonPage({
  competitorName,
  competitorTagline,
  intro,
  summary,
  sections,
  verdict,
  bestFor,
}: ComparisonPageProps) {
  return (
    <div className="min-h-screen bg-background">
      <SiteNav />

      <section className="border-b border-border/60">
        <div className="max-w-5xl mx-auto px-6 pt-20 pb-14">
          <p className="text-xs uppercase tracking-widest text-muted-foreground mb-4">
            Comparativa
          </p>
          <h1 className="font-display text-5xl md:text-6xl leading-[1.05] tracking-tight">
            Cloro <span className="text-muted-foreground">vs</span> {competitorName}
          </h1>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl">{competitorTagline}</p>
          <p className="mt-6 text-base text-foreground/80 max-w-3xl leading-relaxed">{intro}</p>

          <ul className="mt-8 grid gap-3 sm:grid-cols-2 max-w-3xl">
            {summary.map((s) => (
              <li
                key={s}
                className="flex items-start gap-2 text-sm text-foreground/90 bg-surface border border-border/60 rounded-lg px-4 py-3"
              >
                <Check className="size-4 text-primary mt-0.5 shrink-0" strokeWidth={2.5} />
                <span>{s}</span>
              </li>
            ))}
          </ul>

          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href="/#cta"
              className="inline-flex items-center justify-center h-10 px-5 rounded-md bg-foreground text-background text-sm font-medium hover:opacity-90 transition shadow-soft"
            >
              Prueba Cloro gratis <ArrowRight className="size-4 ml-1.5" />
            </a>
            <a
              href="/#precios"
              className="inline-flex items-center justify-center h-10 px-5 rounded-md border border-border text-sm font-medium hover:bg-surface transition"
            >
              Ver precios
            </a>
          </div>
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-6 py-16">
        {sections.map((section) => (
          <div key={section.title} className="mb-12 last:mb-0">
            <h2 className="font-display text-2xl mb-5">{section.title}</h2>
            <div className="border border-border/60 rounded-xl overflow-hidden bg-surface">
              <div className="grid grid-cols-[1.5fr_1fr_1fr] bg-background/60 border-b border-border/60">
                <div className="px-5 py-3 text-xs uppercase tracking-wider text-muted-foreground font-medium">
                  Característica
                </div>
                <div className="px-5 py-3 text-xs uppercase tracking-wider text-foreground font-semibold">
                  Cloro
                </div>
                <div className="px-5 py-3 text-xs uppercase tracking-wider text-muted-foreground font-medium">
                  {competitorName}
                </div>
              </div>
              {section.rows.map((row, i) => (
                <div
                  key={row.feature}
                  className={`grid grid-cols-[1.5fr_1fr_1fr] items-start ${
                    i !== section.rows.length - 1 ? "border-b border-border/60" : ""
                  }`}
                >
                  <div className="px-5 py-4">
                    <div className="text-sm font-medium text-foreground">{row.feature}</div>
                    {row.detail && (
                      <div className="text-xs text-muted-foreground mt-1">{row.detail}</div>
                    )}
                  </div>
                  <div className="px-5 py-4">
                    <Cell value={row.cloro} />
                  </div>
                  <div className="px-5 py-4">
                    <Cell value={row.competitor} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}

        <div className="mt-16 grid gap-5 md:grid-cols-2">
          <div className="border border-border/60 rounded-xl p-6 bg-surface">
            <h3 className="font-display text-xl mb-2">Elige Cloro si…</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">{bestFor.cloro}</p>
          </div>
          <div className="border border-border/60 rounded-xl p-6 bg-surface">
            <h3 className="font-display text-xl mb-2">Elige {competitorName} si…</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">{bestFor.competitor}</p>
          </div>
        </div>

        <div className="mt-12 border border-border/60 rounded-xl p-8 bg-gradient-pool/10">
          <h3 className="font-display text-2xl mb-3">Conclusión</h3>
          <p className="text-base text-foreground/90 leading-relaxed">{verdict}</p>
          <div className="mt-6">
            <a
              href="/#cta"
              className="inline-flex items-center justify-center h-10 px-5 rounded-md bg-foreground text-background text-sm font-medium hover:opacity-90 transition shadow-soft"
            >
              Prueba Cloro gratis <ArrowRight className="size-4 ml-1.5" />
            </a>
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
