---
title: "Cómo llevar el control del cloro de una piscina desde una app (RD 742/2013)"
seoTitle: "Control del cloro de una piscina desde una app"
description: "Guía para registrar cloro libre, pH, TAC y turbidez desde el móvil y cumplir el RD 742/2013 sin libretas ni informes SILOÉ que no cuadran."
date: 2026-06-29
author: equipo-cloro
tags:
  - "Cloro"
  - "Química"
  - "Cumplimiento"
keywords:
  - "control cloro piscina"
  - "app cloro piscina"
  - "registro pH piscina"
  - "parámetros RD 742/2013"
  - "control químico piscina móvil"
  - "SILOÉ cloro"
cover: rd-742.jpg
coverAlt: "Portada del artículo sobre control de cloro con app móvil"
tldr: "Apuntar cloro y pH en libreta y pasarlos luego a un Excel es la primera causa de informes SILOÉ que no cuadran con la realidad. Con Cloro, el técnico registra cloro libre, pH, TAC y turbidez desde el móvil en cada visita y el informe SILOÉ se genera solo cumpliendo el RD 742/2013."
faqs:
  - question: "¿Puedo usar la app sin cobertura?"
    answer: "Sí. Los valores se guardan en local y se sincronizan al recuperar señal. La firma sigue siendo válida."
  - question: "¿Reemplaza al fotómetro?"
    answer: "No. La medida sigue haciéndose con fotómetro o kit. La app sustituye la libreta y el Excel."
  - question: "¿Sirve para instalaciones con varios vasos?"
    answer: "Sí. Cada vaso se registra por separado con su propio historial y sus propios rangos."
  - question: "¿Los datos son válidos ante Sanidad?"
    answer: "Sí, si el registro incluye fecha, hora, técnico identificado y acción correctiva cuando procede. Cloro cumple los tres requisitos."
---
## El problema: cloro apuntado en libreta y transcrito al día siguiente

El flujo clásico de control del cloro en una empresa de mantenimiento de piscinas es más frágil de lo que parece:

1. El técnico mide con fotómetro o kit y apunta los valores en una libreta.
2. Al terminar la ruta, envía una foto de la hoja al grupo de WhatsApp.
3. En oficina, alguien transcribe esas lecturas a Excel al día siguiente (o el lunes).
4. A fin de mes se recompone el SILOÉ con esas lecturas.

Cada paso es una oportunidad para equivocarse. Un "0,8" que parece "0,3", un pH sin decimal, una piscina que se saltó porque la libreta se mojó. Cuando el informe llega a Sanidad, los datos que aparecen ahí no siempre reflejan lo que ocurrió en el borde del vaso.

Los síntomas típicos son:

- Valores impropios (pH de 6,2 o cloro de 3,5) que nadie corrigió porque la anomalía no saltó en el momento.
- Días sin lectura en instalaciones que sí se visitaron.
- Cloro combinado sin calcular porque solo se apuntó "cloro" a secas.
- Falta de acción correctiva registrada cuando un valor se salió de rango.

Cualquiera de esos cuatro puntos justifica por sí solo un requerimiento sanitario.

## Qué parámetros exige el RD 742/2013 en cada visita

El **Real Decreto 742/2013** obliga al titular de la piscina a registrar de forma diaria (con la frecuencia que fije la autoridad autonómica) al menos los siguientes parámetros durante el horario de apertura:

| Parámetro | Rango habitual | Por qué importa |
| --- | --- | --- |
| Cloro libre residual | 0,5 – 2,0 mg/L | Es el desinfectante activo real en el agua. |
| Cloro combinado | ≤ 0,6 mg/L | Indica cloraminas: irritación, olor, mala desinfección. |
| pH | 7,2 – 7,8 | Fuera de rango el cloro pierde eficacia y ataca la instalación. |
| Turbidez | ≤ 1 UNF | Sin transparencia, el cloro no llega a todos los microorganismos. |
| Temperatura | Registro | Afecta al consumo de cloro y al confort del bañista. |
| Aforo | Registro | Necesario para dimensionar la desinfección. |

La normativa exige además registrar la acción correctiva cuando un valor se sale, no solo el valor. Si no consta qué se hizo cuando el cloro bajó a 0,2, para Sanidad es como si nada se hubiera hecho.

Si quieres el detalle completo con plazos, analíticas de laboratorio y responsabilidades, revisa la [normativa de piscinas comunitarias en España en 2025](/blog/normativa-piscinas-comunitarias-espana-2025).

## Por qué la libreta y el Excel no bastan

Tres razones concretas:

- **Error humano en transcripción.** Estudios sobre registros manuales en cualquier sector estiman un error del 1 %–3 % por dato transcrito. Con cuatro parámetros por visita y cientos de visitas al mes, se acumulan decenas de valores inventados sin querer.
- **Sin validación en tiempo real.** La libreta no avisa cuando el pH está fuera de rango. El técnico se entera cuando ya está en la siguiente piscina.
- **Sin trazabilidad.** No sabes quién midió, a qué hora, con qué equipo. Para SILOÉ eso es información útil; para una inspección, casi obligatoria.

## Cómo lo resuelve una app en el móvil

Una app pensada para el técnico en el borde de la piscina hace tres cosas que el papel no puede hacer:

1. **Registro guiado por parámetro.** El técnico ve los campos obligatorios del RD 742/2013 y no puede cerrar el parte sin rellenarlos.
2. **Validación en el momento.** Si mete un cloro de 0,2, la app pide acción correctiva antes de continuar y la deja registrada.
3. **Cálculo automático.** El cloro combinado se calcula solo (cloro total − cloro libre), sin restar a mano.

A eso se suma la geolocalización, la hora exacta y la identidad del técnico. La lectura deja de ser una anotación suelta y se convierte en una prueba documental.

## Cómo lo hace Cloro específicamente

En Cloro, el control del cloro funciona así en cada visita:

- El técnico abre la piscina en la app y ve los últimos valores registrados, para detectar tendencias sospechosas.
- Registra cloro libre, cloro total (Cloro calcula el combinado), pH, TAC, turbidez y temperatura desde el móvil, con validación de rangos según el RD 742/2013.
- Si un parámetro se sale, la app pide obligatoriamente qué acción correctiva se tomó (dosificación, retirada del baño, aviso al titular).
- Adjunta foto del fotómetro si tu protocolo interno lo pide.
- Firma el cliente en la pantalla y cierra el parte.
- El informe SILOÉ se genera automáticamente a fin de mes con esos datos, sin transcribir nada.

Y como los datos viven en un sistema, no en una libreta, cuando alguien pregunta "¿cómo estaba esa piscina el 12 de julio a las 10 de la mañana?", la respuesta llega en dos clics.

Si además quieres eliminar el papel de toda la operativa y no solo del control químico, [comparar partes de trabajo digitales frente a papel](/blog/partes-trabajo-piscinas-digitales-vs-papel) es un buen siguiente paso.

---

Con Cloro, el técnico registra cloro libre, pH, TAC y turbidez desde el móvil en cada visita. El informe SILOÉ se genera solo y cumple el RD 742/2013 sin trabajo extra.
