import { z } from "zod";

export const contactSchema = z.object({
  name: z.string().trim().min(1, "Indica tu nombre").max(200),
  email: z.string().trim().email("Email no válido").max(255),
  company: z.string().trim().max(200).default(""),
  phone: z.string().trim().max(50).default(""),
  message: z.string().trim().min(5, "Cuéntanos un poco más").max(500),
  website: z.string().max(1000).default(""),
  submissionId: z.string().uuid(),
});

export type ContactInput = z.infer<typeof contactSchema>;

export function transactionalPayload(data: ContactInput) {
  return {
    transactionalId: "cmvgrblm2027j0j1wvksob5f5",
    email: "elena@tertie.co",
    replyTo: data.email,
    dataVariables: {
      name: data.name,
      email: data.email,
      company: data.company,
      message: data.message,
    },
  };
}

export function contactPayload(data: ContactInput) {
  return { email: data.email, firstName: data.name, source: "contact-form" };
}