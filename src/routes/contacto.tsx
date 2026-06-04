import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { z } from "zod";
import { Mail, MessageSquare, CheckCircle2 } from "lucide-react";

const URL_PATH = "/contacto";

export const Route = createFileRoute("/contacto")({
  head: () => ({
    meta: [
      { title: "Contacto — Cloro · Software para empresas de piscinas" },
      {
        name: "description",
        content:
          "Habla con el equipo de Cloro. Resolvemos dudas sobre rutas, SILOÉ, facturación VeriFactu y migración desde Excel u otros programas.",
      },
      { property: "og:title", content: "Contacto — Cloro" },
      {
        property: "og:description",
        content: "Escríbenos y te respondemos en menos de 24 horas laborables.",
      },
      { property: "og:url", content: `https://cloro.app${URL_PATH}` },
    ],
    links: [{ rel: "canonical", href: `https://cloro.app${URL_PATH}` }],
  }),
  component: ContactPage,
});

const contactSchema = z.object({
  name: z.string().trim().min(1, "Indica tu nombre").max(200),
  email: z.string().trim().email("Email no válido").max(320),
  company: z.string().trim().max(200).optional().or(z.literal("")),
  phone: z.string().trim().max(50).optional().or(z.literal("")),
  message: z.string().trim().min(5, "Cuéntanos un poco más").max(5000),
});

function ContactPage() {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState<string>("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");
    setErrorMsg("");
    const formData = new FormData(e.currentTarget);
    const parsed = contactSchema.safeParse({
      name: formData.get("name"),
      email: formData.get("email"),
      company: formData.get("company") ?? "",
      phone: formData.get("phone") ?? "",
      message: formData.get("message"),
    });
    if (!parsed.success) {
      setStatus("error");
      setErrorMsg(parsed.error.issues[0]?.message ?? "Datos no válidos");
      return;
    }
    const { error } = await supabase.from("contact_messages").insert({
      name: parsed.data.name,
      email: parsed.data.email,
      company: parsed.data.company || null,
      phone: parsed.data.phone || null,
      message: parsed.data.message,
    });
    if (error) {
      setStatus("error");
      setErrorMsg("No hemos podido enviar el mensaje. Inténtalo de nuevo.");
      return;
    }
    setStatus("success");
    (e.target as HTMLFormElement).reset();
  }

  return (
    <main className="max-w-3xl mx-auto px-6 py-16">
      <div className="text-center mb-12">
        <span className="inline-flex items-center gap-2 text-xs font-medium text-muted-foreground bg-surface border border-border/60 px-3 py-1 rounded-full">
          <MessageSquare className="size-3.5" /> Contacto
        </span>
        <h1 className="font-display text-4xl md:text-5xl mt-4 tracking-tight">
          Hablemos de tu empresa de piscinas
        </h1>
        <p className="mt-4 text-muted-foreground max-w-xl mx-auto">
          Te respondemos en menos de 24 horas laborables. Sin formularios eternos
          ni llamadas comerciales agresivas.
        </p>
      </div>

      {status === "success" ? (
        <div className="rounded-2xl border border-border/60 bg-surface p-8 text-center">
          <CheckCircle2 className="size-12 mx-auto text-primary" />
          <h2 className="font-display text-2xl mt-4">Mensaje recibido</h2>
          <p className="text-muted-foreground mt-2">
            Gracias por escribirnos. Te contestamos al email que nos has facilitado.
          </p>
          <button
            onClick={() => setStatus("idle")}
            className="mt-6 inline-flex items-center justify-center h-10 px-5 rounded-md border border-border text-sm font-medium hover:bg-surface transition"
          >
            Enviar otro mensaje
          </button>
        </div>
      ) : (
        <form
          onSubmit={handleSubmit}
          className="rounded-2xl border border-border/60 bg-surface p-6 md:p-8 space-y-5"
        >
          <div className="grid md:grid-cols-2 gap-5">
            <Field label="Nombre *" name="name" type="text" required />
            <Field label="Email *" name="email" type="email" required />
          </div>
          <div className="grid md:grid-cols-2 gap-5">
            <Field label="Empresa" name="company" type="text" />
            <Field label="Teléfono" name="phone" type="tel" />
          </div>
          <div>
            <label className="text-sm font-medium block mb-1.5">Mensaje *</label>
            <textarea
              name="message"
              required
              rows={5}
              maxLength={5000}
              placeholder="¿Cuántas piscinas mantienes? ¿Qué herramientas usas hoy?"
              className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
            />
          </div>
          {errorMsg && (
            <p className="text-sm text-destructive">{errorMsg}</p>
          )}
          <button
            type="submit"
            disabled={status === "loading"}
            className="w-full sm:w-auto inline-flex items-center justify-center h-11 px-6 rounded-md bg-foreground text-background text-sm font-medium hover:opacity-90 transition shadow-soft disabled:opacity-60"
          >
            {status === "loading" ? "Enviando..." : "Enviar mensaje"}
          </button>
          <p className="text-xs text-muted-foreground flex items-center gap-1.5">
            <Mail className="size-3.5" /> También puedes escribirnos a hola@cloro.app
          </p>
        </form>
      )}
    </main>
  );
}

function Field({ label, name, type, required }: { label: string; name: string; type: string; required?: boolean }) {
  return (
    <div>
      <label className="text-sm font-medium block mb-1.5">{label}</label>
      <input
        name={name}
        type={type}
        required={required}
        className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
      />
    </div>
  );
}
