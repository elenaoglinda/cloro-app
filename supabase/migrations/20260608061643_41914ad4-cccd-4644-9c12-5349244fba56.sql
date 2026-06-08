ALTER TABLE public.partes
  ADD COLUMN IF NOT EXISTS tipo_control TEXT NOT NULL DEFAULT 'rutina' CHECK (tipo_control IN ('rutina', 'periodico', 'inicial')),
  ADD COLUMN IF NOT EXISTS hora_medicion TIME,
  ADD COLUMN IF NOT EXISTS turbidez NUMERIC,
  ADD COLUMN IF NOT EXISTS transparencia_fondo BOOLEAN,
  ADD COLUMN IF NOT EXISTS redox NUMERIC,
  ADD COLUMN IF NOT EXISTS tiempo_recirculacion NUMERIC,
  ADD COLUMN IF NOT EXISTS bromo_total NUMERIC,
  ADD COLUMN IF NOT EXISTS ecoli BOOLEAN,
  ADD COLUMN IF NOT EXISTS pseudomonas BOOLEAN,
  ADD COLUMN IF NOT EXISTS adjunto_laboratorio_url TEXT;