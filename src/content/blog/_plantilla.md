---
# Plantilla de artículo. Copia este archivo como src/content/blog/<slug>.md
# (los archivos que empiezan por "_" no se publican). El nombre del archivo es la URL:
#   src/content/blog/cloro-combinado-piscina.md -> https://cloro.app/blog/cloro-combinado-piscina
title: "Título completo del artículo (H1), 20–110 caracteres"
# Opcional: versión corta para Google (<title>), máx. 60 caracteres.
seoTitle: "Título corto para Google"
# Meta description: 70–160 caracteres. Es el texto que aparece en Google y al compartir.
description: "Resumen de una o dos frases que invite a hacer clic y contenga la palabra clave principal del artículo."
date: 2026-09-23
# Opcional: fecha de la última actualización importante.
# updated: 2026-10-01
author: equipo-cloro
tags:
  - "Normativa"
keywords:
  - "palabra clave principal"
  - "palabra clave secundaria"
# Imagen en src/assets/blog/ (idealmente 1280×720 o mayor, 16:9).
cover: rd-742.jpg
coverAlt: "Descripción de lo que muestra la imagen"
tldr: "Resumen de 2–4 frases con la respuesta directa a la pregunta del artículo. Aparece arriba del todo y lo usan los buscadores y asistentes de IA."
faqs:
  - question: "¿Primera pregunta frecuente?"
    answer: "Respuesta breve y directa. Se muestra al final del artículo y genera el FAQPage de schema.org."
  - question: "¿Segunda pregunta frecuente?"
    answer: "Otra respuesta. Puede incluir [enlaces](/blog/otro-articulo) y **negritas**."
# Con draft: true el artículo solo se ve en local (vite dev), nunca en producción.
draft: true
---

## Primera sección

El cuerpo del artículo va en Markdown. Usa `##` para las secciones principales (forman el índice) y `###` para subsecciones. No pongas un `#` (H1): el título ya es el H1.

No añadas una sección de "Preguntas frecuentes" en el cuerpo: se genera automáticamente a partir de `faqs`.
