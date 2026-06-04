import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { fetchContactMessages } from "@/lib/admin.functions";
import { Lock, Mail, Building2, Phone, RefreshCw } from "lucide-react";

export const Route = createFileRoute("/admin/mensajes")({
  head: () => ({
    meta: [
      { title: "Admin · Mensajes — Cloro" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: AdminMessagesPage,
});

type Message = {
  id: string;
  name: string;
  email: string;
  company: string | null;
  phone: string | null;
  message: string;
  created_at: string;
};

function AdminMessagesPage() {
  const fetchFn = useServerFn(fetchContactMessages);
  const [password, setPassword] = useState("");
  const [messages, setMessages] = useState<Message[] | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function load(pwd: string) {
    setLoading(true);
    setError("");
    try {
      const res = await fetchFn({ data: { password: pwd } });
      setMessages(res.messages as Message[]);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error");
      setMessages(null);
    } finally {
      setLoading(false);
    }
  }

  if (!messages) {
    return (
      <main className="max-w-md mx-auto px-6 py-24">
        <div className="rounded-2xl border border-border/60 bg-surface p-8">
          <div className="size-10 rounded-lg bg-gradient-pool flex items-center justify-center mb-4">
            <Lock className="size-5 text-primary-foreground" />
          </div>
          <h1 className="font-display text-2xl">Panel de mensajes</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Introduce la contraseña de administrador.
          </p>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              load(password);
            }}
            className="mt-6 space-y-3"
          >
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Contraseña"
              autoFocus
              className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
            />
            {error && <p className="text-sm text-destructive">{error}</p>}
            <button
              type="submit"
              disabled={loading || !password}
              className="w-full inline-flex items-center justify-center h-10 px-4 rounded-md bg-foreground text-background text-sm font-medium hover:opacity-90 transition disabled:opacity-60"
            >
              {loading ? "Comprobando..." : "Entrar"}
            </button>
          </form>
        </div>
      </main>
    );
  }

  return (
    <main className="max-w-5xl mx-auto px-6 py-12">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-3xl">Mensajes de contacto</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {messages.length} {messages.length === 1 ? "mensaje" : "mensajes"} en total
          </p>
        </div>
        <button
          onClick={() => load(password)}
          disabled={loading}
          className="inline-flex items-center gap-2 h-9 px-3 rounded-md border border-border text-sm hover:bg-surface transition"
        >
          <RefreshCw className={`size-4 ${loading ? "animate-spin" : ""}`} /> Refrescar
        </button>
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
                <h2 className="font-medium">{m.name}</h2>
                <time className="text-xs text-muted-foreground">
                  {new Date(m.created_at).toLocaleString("es-ES")}
                </time>
              </header>
              <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground mb-3">
                <a href={`mailto:${m.email}`} className="inline-flex items-center gap-1 hover:text-foreground">
                  <Mail className="size-3.5" /> {m.email}
                </a>
                {m.company && (
                  <span className="inline-flex items-center gap-1">
                    <Building2 className="size-3.5" /> {m.company}
                  </span>
                )}
                {m.phone && (
                  <a href={`tel:${m.phone}`} className="inline-flex items-center gap-1 hover:text-foreground">
                    <Phone className="size-3.5" /> {m.phone}
                  </a>
                )}
              </div>
              <p className="text-sm whitespace-pre-wrap">{m.message}</p>
            </article>
          ))}
        </div>
      )}
    </main>
  );
}
