import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const adminLoginSchema = z.object({
  password: z.string().min(1).max(200),
});

export const fetchContactMessages = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => adminLoginSchema.parse(data))
  .handler(async ({ data }) => {
    const expected = process.env.ADMIN_PASSWORD;
    if (!expected) {
      throw new Error("Admin password is not configured");
    }
    if (data.password !== expected) {
      throw new Error("Contraseña incorrecta");
    }
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: messages, error } = await supabaseAdmin
      .from("contact_messages")
      .select("id, name, email, company, phone, message, created_at")
      .order("created_at", { ascending: false })
      .limit(500);
    if (error) throw new Error(error.message);
    return { messages: messages ?? [] };
  });
