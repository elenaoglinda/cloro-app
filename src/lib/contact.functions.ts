import { createServerFn } from "@tanstack/react-start";
import { contactSchema, contactPayload, transactionalPayload } from "./contact-schema";

export const sendContactMessage = createServerFn({ method: "POST" })
  .inputValidator((input) => contactSchema.parse(input))
  .handler(async ({ data }) => {
    // Return the same result for bots without contacting Loops.
    if (data.website) return { success: true as const };

    const apiKey = process.env['LOOPS_API_KEY'];
    const lovableKey = process.env['LOVABLE_API_KEY'];
    if (!apiKey || !lovableKey) {
      return { success: false as const, error: "El envío no está disponible. Inténtalo más tarde." };
    }

    const gatewayUrl = "https://connector-gateway.lovable.dev/loops";
    async function request(path: string, method: string, body: object, idempotencyKey?: string) {
      const response = await fetch(`${gatewayUrl}${path}`, {
        method,
        headers: {
          Authorization: `Bearer ${lovableKey}`,
          "X-Connection-Api-Key": apiKey ?? "",
          "Content-Type": "application/json",
          ...(idempotencyKey ? { "Idempotency-Key": idempotencyKey } : {}),
        },
        body: JSON.stringify(body),
      });
      if (!response.ok) {
        // Provider bodies can contain personal information; keep them out of logs.
        console.error(`Loops ${path} failed [${response.status}]`);
        return false;
      }
      const result = await response.json() as { success?: boolean };
      return result.success !== false;
    }

    try {
      // Upsert first so a contact failure cannot leave a sent email with a failed form.
      const saved = await request("/contacts/update", "PUT", contactPayload(data));
      if (!saved) return { success: false as const, error: "No hemos podido enviar el mensaje. Inténtalo de nuevo." };
      const sent = await request("/transactional", "POST", transactionalPayload(data), data.submissionId);
      if (!sent) return { success: false as const, error: "No hemos podido enviar el mensaje. Inténtalo de nuevo." };
      return { success: true as const };
    } catch {
      return { success: false as const, error: "No hemos podido enviar el mensaje. Comprueba tu conexión e inténtalo de nuevo." };
    }
  });