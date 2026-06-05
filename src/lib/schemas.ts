import { z } from "zod";

const optionalText = (max: number) =>
  z
    .string()
    .trim()
    .max(max)
    .optional()
    .or(z.literal(""))
    .transform((v) => (v && v.length > 0 ? v : null));

export const clienteSchema = z.object({
  nombre: z.string().trim().min(1).max(200),
  email: optionalText(255),
  telefono: optionalText(50),
  direccion: optionalText(500),
  notas: optionalText(2000),
});
export type ClienteInput = z.infer<typeof clienteSchema>;

export const piscinaSchema = z.object({
  cliente_id: z.string().uuid(),
  alias: z.string().trim().min(1).max(120),
  tipo: optionalText(50),
  volumen_m3: z.coerce.number().min(0).max(100000).optional().nullable(),
  sistema_desinfeccion: optionalText(120),
  direccion: optionalText(500),
  notas: optionalText(2000),
});
export type PiscinaInput = z.infer<typeof piscinaSchema>;

const num = () => z.coerce.number().min(0).max(10000).optional().nullable();

export const parteSchema = z.object({
  piscina_id: z.string().uuid(),
  estado: z.enum(["borrador", "completado", "firmado"]).default("completado"),
  ph: num(),
  cloro_libre: num(),
  cloro_total: num(),
  alcalinidad: num(),
  cya: num(),
  sal: num(),
  temp_c: num(),
  observaciones: optionalText(4000),
});
export type ParteInput = z.infer<typeof parteSchema>;
