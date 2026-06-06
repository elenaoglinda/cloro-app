-- Remove duplicate paradas (keep lowest orden / earliest created)
DELETE FROM public.ruta_paradas a
USING public.ruta_paradas b
WHERE a.ruta_id = b.ruta_id
  AND a.piscina_id = b.piscina_id
  AND a.ctid > b.ctid;

ALTER TABLE public.ruta_paradas
  ADD CONSTRAINT ruta_paradas_ruta_piscina_unique UNIQUE (ruta_id, piscina_id);