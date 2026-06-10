import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery } from "@tanstack/react-query";
import { listAllContactMessages } from "@/lib/superadmin.functions";
import { Mail, Building2, Phone } from "lucide-react";

export const Route = createFileRoute("/_authenticated/admin/mensajes")({
  component: AdminMessages,
});

function AdminMessages() {
  const fn = useServerFn(listAllContactMessages);
  const { data, isLoading } = useQuery({
    queryKey: ["admin-messages"],
    queryFn: () => fn(),
  });

  if (isLoading) return <p className="text-sm text-muted-foreground">Cargando…</p>;
  const messages = data?.messages ?? [];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-xl">Mensajes de contacto ({messages.length})</h2>
      </div>

      {messages.length === 0 ? (
        <div className="rounded-2xl border border-border/60 bg-surface p-12 text-center text-muted-foreground">
          No hay mensajes todavía.
        </div>
      ) : (
        <div className="space-y-3">
          {messages.map((m) => (
            <article
              key={m.id}
              className="rounded-xl border border-border/60 bg-surface p-5"
            >
              <header className="flex flex-wrap items-baseline justify-between gap-2 mb-3">
                <h3 className="font-medium">{m.name}</h3>
                <time className="text-xs text-muted-foreground">
                  {new Date(m.created_at).toLocaleString("es-ES")}
                </time>
              </header>
              <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground mb-3">
                <a
                  href={`mailto:${m.email}`}
                  className="inline-flex items-center gap-1 hover:text-foreground"
                >
                  <Mail className="size-3.5" /> {m.email}
                </a>
                {m.company && (
                  <span className="inline-flex items-center gap-1">
                    <Building2 className="size-3.5" /> {m.company}
                  </span>
                )}
                {m.phone && (
                  <a
                    href={`tel:${m.phone}`}
                    className="inline-flex items-center gap-1 hover:text-foreground"
                  >
                    <Phone className="size-3.5" /> {m.phone}
                  </a>
                )}
              </div>
              <p className="text-sm whitespace-pre-wrap">{m.message}</p>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
