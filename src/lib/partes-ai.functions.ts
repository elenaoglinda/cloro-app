import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { createAnthropic } from "@ai-sdk/anthropic";
import { streamText } from "ai";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { createLovableAiGatewayRunIdFetch, getLovableAiKey } from "./ai.server";
import { cloroCombinado } from "./parte-ranges";

const SYSTEM_PROMPT = `Eres un técnico experto en mantenimiento de piscinas en España, con dominio del RD 742/2013 (criterios técnico-sanitarios de piscinas).
Analizas partes de mantenimiento y escribes un dictamen breve y práctico para el técnico que lo ha realizado.

Reglas:
- Responde SIEMPRE en español de España, tono directo y profesional, tratando de tú.
- Estructura la respuesta en exactamente tres secciones con estos encabezados en mayúsculas:
  DIAGNÓSTICO
  ACCIONES RECOMENDADAS
  OBSERVACIONES
- DIAGNÓSTICO: 2-4 frases valorando el estado general del agua según las lecturas y los límites del RD 742/2013 (pH 7,2-8,0; cloro libre 0,5-2,0 mg/L; cloro combinado ≤0,6 mg/L; turbidez ≤5 UNF; desagüe de fondo visible).
- ACCIONES RECOMENDADAS: lista con guiones, acciones concretas y ordenadas por prioridad (química, filtración, higiene). Si algún valor es crítico (p. ej. cloro libre 0 o >5, desagüe no visible, E. coli o Pseudomonas no conformes), indícalo primero y recuerda que puede obligar al cierre de la piscina.
- OBSERVACIONES: 1-3 frases con matices (tendencias, datos que faltan, recomendaciones de seguimiento). Si no hay nada relevante, escribe "Sin observaciones adicionales."
- No inventes datos que no estén en el parte. No uses markdown (sin ** ni #), solo texto plano con los encabezados indicados.
- Máximo 250 palabras.`;

function fmt(v: unknown, unit = ""): string {
  if (v == null || v === "") return "sin dato";
  return `${v}${unit}`;
}

function buildUserMessage(parte: any): string {
  const cc = cloroCombinado(parte.cloro_libre, parte.cloro_total);
  const productos = Array.isArray(parte.productos_usados)
    ? parte.productos_usados.map((x: any) => x.texto ?? "").filter(Boolean).join("; ")
    : "";
  const lineas = [
    `Piscina: ${parte.piscinas?.alias ?? "desconocida"} (cliente: ${parte.piscinas?.clientes?.nombre ?? "desconocido"})`,
    `Tipo de control: ${parte.tipo_control ?? "rutina"}`,
    `Fecha: ${parte.fecha ? new Date(parte.fecha).toLocaleString("es-ES") : "sin dato"}`,
    "",
    "Lecturas:",
    `- pH: ${fmt(parte.ph)}`,
    `- Cloro libre: ${fmt(parte.cloro_libre, " mg/L")}`,
    `- Cloro total: ${fmt(parte.cloro_total, " mg/L")}`,
    `- Cloro combinado: ${cc == null ? "sin dato" : `${cc.toFixed(2)} mg/L`}`,
    `- Turbidez: ${fmt(parte.turbidez, " UNF")}`,
    `- Desagüe de fondo visible: ${parte.transparencia_fondo == null ? "sin dato" : parte.transparencia_fondo ? "sí" : "no"}`,
    `- Temperatura: ${fmt(parte.temp_c, " °C")}`,
    `- REDOX: ${fmt(parte.redox, " mV")}`,
    `- Tiempo de recirculación: ${fmt(parte.tiempo_recirculacion, " h")}`,
    `- Ácido cianúrico (CYA): ${fmt(parte.cya, " mg/L")}`,
    `- Alcalinidad: ${fmt(parte.alcalinidad, " mg/L")}`,
    `- Sal: ${fmt(parte.sal, " g/L")}`,
    `- Bromo total: ${fmt(parte.bromo_total, " mg/L")}`,
    `- E. coli: ${parte.ecoli == null ? "sin dato" : parte.ecoli ? "cumple" : "NO cumple"}`,
    `- Pseudomonas aeruginosa: ${parte.pseudomonas == null ? "sin dato" : parte.pseudomonas ? "cumple" : "NO cumple"}`,
  ];
  if (parte.observaciones) lineas.push("", `Observaciones del técnico: ${parte.observaciones}`);
  if (productos) lineas.push(`Productos usados: ${productos}`);
  return lineas.join("\n");
}

function friendlyError(err: any): string {
  const status = err?.statusCode ?? err?.status ?? err?.response?.status;
  if (status === 401) return "La integración de IA no está configurada correctamente. Contacta con soporte.";
  if (status === 402) return "Créditos de IA agotados. Recarga créditos en la configuración de tu workspace.";
  if (status === 403) return "El acceso a este modelo de IA no está disponible en este momento.";
  if (status === 429) return "Demasiadas solicitudes de IA. Espera unos segundos y vuelve a intentarlo.";
  if (status && status >= 500) return "El servicio de IA no responde ahora mismo. Inténtalo de nuevo en unos minutos.";
  return "No se pudo generar el análisis. Inténtalo de nuevo.";
}

export const analizarParte = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => z.object({ id: z.string().uuid() }).parse(d))
  .handler(async ({ context, data }) => {
    const { data: parte, error } = await context.supabase
      .from("partes")
      .select("*, piscinas(id, alias, clientes(id, nombre))")
      .eq("id", data.id)
      .maybeSingle();
    if (error) throw new Error(error.message);
    if (!parte) throw new Error("Parte no encontrado");

    const runIdFetch = createLovableAiGatewayRunIdFetch();
    const anthropic = createAnthropic({
      baseURL: "https://ai.gateway.lovable.dev/v1",
      apiKey: getLovableAiKey(),
      headers: { "X-Lovable-AIG-SDK": "vercel-ai-sdk" },
      fetch: runIdFetch.fetch,
    });

    try {
      const result = streamText({
        model: anthropic("anthropic/claude-sonnet-5"),
        maxOutputTokens: 16000,
        maxRetries: 0,
        system: SYSTEM_PROMPT,
        messages: [{ role: "user", content: buildUserMessage(parte) }],
      });
      const analisis = (await result.text).trim();
      if (!analisis) throw new Error("empty");
      return { analisis };
    } catch (err: any) {
      throw new Error(friendlyError(err));
    }
  });
