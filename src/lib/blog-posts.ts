import rd742Cover from "@/assets/blog/rd-742.jpg";
import rutasCover from "@/assets/blog/rutas.jpg";
import whatsappCover from "@/assets/blog/whatsapp.jpg";

export type BlogPost = {
  slug: string;
  title: string;
  description: string;
  keywords: string[];
  date: string; // ISO
  readingMinutes: number;
  author: string;
  authorBio: string;
  tags: string[];
  cover: string;
  coverAlt: string;
  tldr: string;
  content: string; // markdown (GFM: headings, lists, tables, bold, links)
};

export const BLOG_POSTS: BlogPost[] = [
  {
    slug: "cumplir-rd-742-2013-guia-completa",
    title:
      "RD 742/2013 en 2026: guía completa para cumplirlo sin requerimientos de Sanidad",
    description:
      "Guía práctica del RD 742/2013 para empresas de mantenimiento de piscinas en España: parámetros diarios, analíticas mensuales, SILOÉ, plazos y los errores que provocan requerimientos.",
    keywords: [
      "RD 742/2013",
      "SILOÉ",
      "mantenimiento de piscinas",
      "parte químico piscina",
      "cumplimiento sanitario piscinas",
      "analítica piscinas",
      "criterios técnico-sanitarios piscinas",
    ],
    date: "2026-06-24",
    readingMinutes: 12,
    author: "Equipo Cloro",
    authorBio:
      "Equipo Cloro publica sobre operaciones, cumplimiento sanitario y digitalización en empresas de mantenimiento de piscinas en España.",
    tags: ["Cumplimiento", "SILOÉ", "RD 742/2013"],
    cover: rd742Cover,
    coverAlt: "Portada del artículo sobre el RD 742/2013",
    tldr:
      "El RD 742/2013 obliga al titular de una piscina de uso público a registrar diariamente pH, cloro libre, cloro combinado, turbidez, temperatura y aforo, a contratar analíticas mensuales en laboratorio acreditado ENAC y a subir los datos a SILOÉ. La mayoría de requerimientos de Sanidad se explican por tres fallos: días sin parte, lecturas fuera de rango sin acción correctiva registrada y analíticas cargadas fuera de plazo. Un buen software operativo evita los tres.",
    content: `## Qué es el RD 742/2013 y a quién aplica

El **Real Decreto 742/2013**, de 27 de septiembre, establece los criterios técnico-sanitarios de las piscinas en España. Es la norma de referencia para cualquier vaso considerado de **uso público**: comunidades de propietarios con más de una vivienda, hoteles, cámpings, polideportivos, spas, gimnasios, colegios y cualquier instalación de acceso colectivo.

Quedan fuera del RD 742/2013 las piscinas unifamiliares privadas de uso exclusivo del propietario y su núcleo familiar. Todo lo demás entra, y las empresas de mantenimiento que operan estos vasos son las que en la práctica generan y archivan los registros que exige la norma.

El titular de la instalación es el responsable legal, pero el técnico de mantenimiento es quien ejecuta el control y firma los partes. Un contrato de mantenimiento bien redactado deja claro quién sube los datos a SILOÉ y quién conserva los registros durante el año que exige la norma.

## Parámetros de control diario

El RD 742/2013 obliga a controlar en cada visita, con la frecuencia mínima que fije la autoridad autonómica, los siguientes parámetros:

| Parámetro | Rango habitual | Frecuencia mínima |
| --- | --- | --- |
| pH | 7,2 – 8,0 | Diaria |
| Cloro libre residual | 0,5 – 2,0 mg/L | Diaria |
| Cloro combinado | ≤ 0,6 mg/L | Diaria |
| Turbidez | ≤ 5 UNF (recomendado ≤ 1) | Diaria |
| Temperatura del agua | Climatizadas: 24–30 °C | Diaria |
| Temperatura del aire | Climatizadas: T agua + 2 °C | Diaria |
| Aforo | Según proyecto | Diaria |
| Transparencia | Fondo del vaso visible | Diaria |

Algunos parámetros se registran cuando aplica: **redox** en vasos con dosificación automática, **bromo total** en vasos que usan bromo en lugar de cloro, y **tiempo de recirculación** cuando el proyecto lo especifica.

Todos los valores fuera de rango deben acompañarse de la **acción correctiva** aplicada. Un parte con pH 8,7 y ninguna nota es un requerimiento asegurado. Un parte con pH 8,7 y la nota "añadido reductor de pH, próxima medición en 2 h" es un parte defendible.

## Analíticas mensuales en laboratorio ENAC

Además del parte diario, el RD 742/2013 exige un **control mensual** por parte de un laboratorio acreditado por ENAC bajo la norma UNE-EN ISO/IEC 17025. Los parámetros mínimos son:

- **Microbiológicos**: recuento total de aerobios a 37 °C, *Escherichia coli*, *Pseudomonas aeruginosa* y, en climatizadas, *Legionella spp*.
- **Físico-químicos**: pH, cloro libre y combinado, oxidabilidad al permanganato, turbidez, ácido isocianúrico (si se usan estabilizados), nitratos y conductividad.

El informe del laboratorio se archiva junto al parte diario correspondiente y se sube a **SILOÉ** en cuanto está disponible. En la mayoría de comunidades autónomas la ventana práctica es de **15 días** desde la toma de muestra.

Si un parámetro sale fuera, la norma obliga a repetir la analítica y a documentar la acción correctiva. Repetir sin documentar no vale.

## SILOÉ: cómo funciona y qué esperan las autoridades

**SILOÉ** es el Sistema de Información Nacional de Aguas de Consumo aplicado al ámbito de piscinas, y es el sistema oficial de recogida de datos del RD 742/2013. Cada comunidad autónoma tiene su propia implantación con matices, pero el flujo común es siempre el mismo:

1. El titular de la instalación se da de alta y registra sus vasos con sus datos de proyecto.
2. Los partes diarios se suben, normalmente en lote mensual, como XML estructurado.
3. Las analíticas mensuales se adjuntan como PDF vinculado al parte correspondiente.
4. Sanidad autonómica accede a los datos y puede requerir corrección de errores.

Los errores de carga más habituales son de formato: fechas mal codificadas, unidades incorrectas, valores decimales con coma en un campo que espera punto, o códigos de vaso que no coinciden con el alta. Un software que genera el XML directamente desde el parte firmado ahorra las tres cuartas partes de estos requerimientos.

## Los 5 errores que más requerimientos provocan

Los expedientes que abre Sanidad se repiten. Estos son los patrones más frecuentes:

1. **Días sin parte**. El vaso está abierto al público y no hay registro de esa jornada. Es el error número uno.
2. **Lecturas fuera de rango sin acción correctiva escrita**. El valor se anota, pero el técnico no deja constancia de qué hizo para corregirlo.
3. **Analíticas mensuales fuera de plazo**. La toma de muestra se hace, pero el informe se sube semanas o meses después.
4. **Firmas ausentes**. La norma exige firma del responsable de mantenimiento; muchos partes históricos se suben sin ella y provocan requerimiento formal.
5. **Datos inconsistentes entre parte y analítica**. La analítica marca pH 7,4 y el parte del mismo día marca pH 8,2. Sin explicación, es un banderín rojo.

Los cinco fallos son operativos, no técnicos. Ninguno requiere formación química adicional del equipo; sí requiere un flujo de trabajo digital que no deje huecos.

## Cómo cumplir con menos fricción

El equipo que cumple sin sudar tiene cuatro cosas en su día a día:

- **Parte digital con validaciones**. La app avisa si un valor está fuera de rango antes de guardar, obliga a introducir la acción correctiva y no permite cerrar el parte sin firma.
- **Foto opcional del kit de medición**. Un adjunto probatorio elimina la mayoría de disputas.
- **Alerta automática de analítica mensual**. El sistema sabe la fecha de la última analítica y avisa 5 días antes del vencimiento.
- **Exportación SILOÉ en un clic**. El XML se genera desde los partes reales; no se rehace a mano en Excel.

Estas cuatro piezas convierten el cumplimiento en un subproducto del trabajo diario en lugar de un proyecto trimestral que se atrasa.

## Semáforo de parámetros: verde, ámbar, rojo

Un patrón de trabajo que funciona bien es traducir cada lectura a un **semáforo**:

- **Verde**: dentro de rango, sin acción.
- **Ámbar**: cerca del límite, exige nota y próxima medición.
- **Rojo**: fuera de rango, exige acción correctiva inmediata y verificación en la siguiente visita.

El semáforo tiene dos ventajas prácticas. Para el técnico, reduce la carga cognitiva: ve un color antes de leer el número. Para el gestor, permite auditar 200 piscinas en 30 segundos: cuenta los rojos y ámbar del mes y sabe dónde intervenir.

## Cambios previstos: qué está en discusión para 2026-2027

Aunque el RD 742/2013 sigue vigente, hay tres corrientes de trabajo que las asociaciones del sector siguen de cerca:

- **Actualización de rangos** para adaptarlos a las recomendaciones de la OMS de 2023, especialmente en turbidez y cloro combinado.
- **Digitalización obligatoria del parte diario** en algunas comunidades autónomas, dejando de aceptar cuadernos en papel.
- **Frecuencia analítica variable** en función del aforo real, no del aforo teórico del proyecto.

Ninguno de los tres cambios está publicado en BOE al escribir esto. Merece la pena diseñar el flujo digital pensando en que llegarán, no en que no.

## Resumen

El RD 742/2013 pide tres cosas: **parte diario completo y firmado**, **analítica mensual en laboratorio ENAC** y **carga puntual en SILOÉ**. Cumplirlo no es difícil, pero requiere una disciplina operativa que el papel y el WhatsApp del grupo interno no dan.

Un flujo digital que valida las lecturas, obliga a documentar las acciones correctivas, gestiona las analíticas y genera el XML SILOÉ resuelve el 95 % del riesgo regulatorio con menos trabajo que el sistema en papel. La otra cara del cumplimiento es que, bien montado, se convierte en un argumento comercial delante del administrador de fincas.

## FAQ

**¿Se aplica el RD 742/2013 a una piscina de comunidad de vecinos?**

Sí, siempre que la comunidad tenga más de una vivienda. Las unifamiliares privadas quedan fuera. Todas las demás piscinas de comunidad están dentro y deben registrar parte diario, contratar analítica mensual y subir a SILOÉ.

**¿Puede el técnico de mantenimiento firmar el parte en nombre del titular?**

El técnico firma su responsabilidad sobre las lecturas y las acciones correctivas. La responsabilidad legal del cumplimiento sigue siendo del titular de la instalación. Un contrato de mantenimiento bien redactado clarifica los roles pero no traslada la responsabilidad última.

**¿Cuánto tiempo hay que conservar los partes y las analíticas?**

Como mínimo un año desde la fecha del registro. En la práctica se recomiendan cinco años para cubrir cualquier reclamación civil derivada de un incidente sanitario.

**¿Vale un parte hecho en Excel?**

Vale si contiene los campos obligatorios y está firmado. No vale si Sanidad pide auditar la trazabilidad del dato y no puedes demostrar quién lo introdujo, cuándo, ni si se modificó después. El papel firmado o el parte digital con log de auditoría son las dos alternativas defendibles.

**¿Qué pasa si una analítica mensual sale fuera de rango?**

Debes repetirla, documentar la acción correctiva aplicada entre las dos tomas y subir ambos informes a SILOÉ. La comunidad autónoma puede solicitar el cierre temporal del vaso hasta la analítica de verificación.

**¿SILOÉ es igual en todas las comunidades autónomas?**

El esquema de datos común lo es, pero cada CCAA tiene su portal y ligeros matices en validaciones y códigos. Un software que exporta XML SILOÉ estándar suele resolver el 100 % de las CCAA que usan la implantación oficial y requiere pequeños ajustes en las que han desarrollado la suya.

**¿Se puede automatizar la carga a SILOÉ?**

Hoy la mayoría de portales autonómicos exigen subida manual del XML. La automatización por API existe solo en pilotos. Un sistema que genera el XML validado y lo deja listo para subir en un clic es el máximo nivel de automatización realista en 2026.
`,
  },
  {
    slug: "rutas-optimizadas-mantenimiento-piscinas",
    title:
      "Rutas optimizadas para mantenimiento de piscinas: cómo ahorrar 2 horas al día",
    description:
      "Cómo diseñar rutas de mantenimiento de piscinas usando tráfico en tiempo real, ventanas horarias reales y tiempos medios por vaso. Metodología, ejemplo numérico y errores frecuentes.",
    keywords: [
      "rutas mantenimiento piscinas",
      "optimización rutas piscinas",
      "software rutas piscinas",
      "planificación mantenimiento piscinas",
      "eficiencia técnico piscinas",
      "Google Maps rutas piscinas",
    ],
    date: "2026-06-10",
    readingMinutes: 9,
    author: "Equipo Cloro",
    authorBio:
      "Equipo Cloro publica sobre operaciones, cumplimiento sanitario y digitalización en empresas de mantenimiento de piscinas en España.",
    tags: ["Operaciones", "Rutas", "Productividad"],
    cover: rutasCover,
    coverAlt: "Portada del artículo sobre rutas optimizadas",
    tldr:
      "La mayor pérdida de tiempo en mantenimiento de piscinas no está en el trabajo técnico sino entre parada y parada. Cruzando tráfico en tiempo real, ventanas horarias reales del cliente y tiempo medio real por vaso, una ruta típica de 18 piscinas baja de ~7,5 h a ~5,5 h. Esas dos horas son el margen entre una ruta rentable y una que no lo es.",
    content: `## El problema real: el tiempo entre paradas

Una jornada de un técnico de mantenimiento de piscinas se descompone así, de media, en la temporada alta española:

| Bloque | Tiempo típico | % de la jornada |
| --- | --- | --- |
| Trabajo técnico en vaso | 3,0 h | 40 % |
| Desplazamiento entre paradas | 2,5 h | 33 % |
| Carga/descarga de material | 0,5 h | 7 % |
| Cliente y comunicación | 0,5 h | 7 % |
| Administración y parte | 1,0 h | 13 % |
| **Total** | **7,5 h** | **100 %** |

El bloque más comprimible no es el técnico —hacer bien un análisis y una limpieza tiene su tiempo mínimo— sino el desplazamiento. Reducir 2,5 h a 1,0 h por técnico y día es realista y devuelve **hasta dos piscinas adicionales por ruta** sin trabajar más horas.

## Las tres variables que casi nadie cruza

La mayoría de rutas se planifican con criterios de vecindario ("esta ruta es la de La Cala") y frecuencia ("los lunes toca este bloque"). Falta cruzar tres variables cuantitativas:

1. **Tráfico en tiempo real** por franja horaria y día de la semana. El trayecto Sevilla centro → Aljarafe a las 8:00 es distinto del mismo trayecto a las 13:00.
2. **Ventanas horarias reales del cliente**. Comunidades que sólo abren mañanas, hoteles con check-in a las 14:00 que prefieren la visita antes, restaurantes que piden después de las 17:00.
3. **Tiempo medio real por piscina**, medido con datos reales de partes históricos, no estimado a ojo. Un vaso de 40 m³ con dos analíticas al día no lleva lo mismo que uno de 200 m³ climatizado.

Cruzarlas requiere dos cosas: un modelo de optimización y datos limpios. El modelo lo resuelve una API de Routes (Google, HERE, Mapbox). Los datos limpios los da la operación diaria si el parte digital los recoge sin fricción.

## Cómo diseñar una ruta óptima en 5 pasos

El procedimiento que funciona en producción no es complicado:

1. **Lista las piscinas que toca hoy**, con dirección exacta y coordenadas geocodificadas.
2. **Marca las ventanas horarias** de cada una: hora mínima de acceso y hora máxima aceptable.
3. **Asocia el tiempo medio real** a cada vaso desde el historial de partes.
4. **Deja que el motor de optimización proponga el orden óptimo** con la matriz de distancias y tráfico previsto en la franja de cada parada.
5. **Revisa manualmente** las 2-3 aristas más largas por si hay razones humanas que el algoritmo no ve (obras, evento local, cliente sensible).

Un motor de optimización moderno resuelve rutas de 20-30 paradas en menos de 2 segundos. La foto mental del "problema del viajante" es obsoleta: hoy es una llamada HTTP.

## Ejemplo numérico

Ruta real de 18 piscinas en el área metropolitana de Sevilla, temporada alta:

| Método | Distancia total | Tiempo desplazamiento | Duración jornada |
| --- | --- | --- | --- |
| Orden manual histórico | 124 km | 3 h 20 min | 7 h 40 min |
| Orden geográfico simple | 98 km | 2 h 45 min | 7 h 05 min |
| Optimización con tráfico + ventanas | 78 km | 1 h 55 min | 5 h 30 min |

El ahorro no viene sólo de menos kilómetros. Viene de **evitar franjas malas de tráfico** y **respetar ventanas de acceso** que antes obligaban a volver.

## Navegación nativa: no reinventes el mapa

El técnico no quiere una app más. Quiere que al pulsar "siguiente parada" se abra **Google Maps o Waze** con la dirección ya cargada. Todo lo demás sobra.

La regla práctica: **la app operativa decide el orden, la app de navegación conduce**. Duplicar el mapa dentro de tu propia app rara vez suma valor y siempre añade fricción y dependencias. Un botón "Abrir en Google Maps" y otro "Abrir en Waze" cubren el 100 % de los casos.

## Errores frecuentes al montar rutas

Cinco patrones se repiten en empresas que "ya usan software" pero siguen perdiendo tiempo:

- **Optimizar solo por distancia**. Ignorar tráfico y ventanas horarias produce rutas cortas en kilómetros pero largas en tiempo.
- **Meter todas las paradas sin coordenadas exactas**. Una dirección mal geocodificada arrastra 15 minutos de "búsqueda" al llegar.
- **No medir el tiempo real por vaso**. Usar 20 minutos como default para todos hace que la ruta se descuadre a partir de la cuarta parada.
- **Reoptimizar en caliente cada mañana**. El técnico necesita previsibilidad. Reoptimización silenciosa antes de arrancar la jornada, no en directo durante el día.
- **No cerrar el bucle con el parte real**. Si el parte no registra hora de llegada y salida, no puedes medir mejoras.

## Qué medir para saber que la optimización funciona

Cuatro métricas simples, todas extraíbles del propio parte digital:

- **Tiempo medio por parada** (llegada → salida).
- **Tiempo medio entre paradas** (salida de una → llegada a la siguiente).
- **Puntualidad respecto a ventana** (paradas dentro de ventana / total).
- **Ratio de vueltas por zona** (kilómetros / paradas).

Con estas cuatro métricas por técnico y semana ves el efecto real. Si sube el número de piscinas hechas por jornada sin que baje la calidad del parte, la optimización está funcionando.

## Resumen

Optimizar rutas de mantenimiento de piscinas no es un problema matemático: es un problema de datos limpios y flujo operativo. Con tráfico real, ventanas del cliente y tiempo real por vaso, se recuperan **entre 1,5 h y 2 h por técnico y día**. El impacto en margen de una empresa de 4 técnicos es directo.

La regla es: **la app operativa decide, la app de navegación conduce, y el parte digital cierra el bucle** con los datos que alimentan la siguiente iteración.

## FAQ

**¿Necesito Google Maps para optimizar rutas de piscinas?**

No es la única opción, pero es la más rentable en España. HERE y Mapbox también tienen APIs de Routes competitivas. Waze no ofrece API pública de optimización; sirve para conducir, no para planificar.

**¿Cuánto cuesta la optimización por API en volumen real?**

Para una empresa de 4-6 técnicos con 20 paradas/día, el coste mensual de la API de Google Routes ronda los 20-40 €. El ahorro operativo cubre eso muchas veces.

**¿Merece la pena reoptimizar en tiempo real si hay un imprevisto?**

Sí, si el imprevisto es grande (cancelación, avería). No, si es una parada que se alarga 10 minutos: reoptimizar por microdelays introduce más caos del que resuelve.

**¿Cómo mido el tiempo medio real por piscina si el parte lo hace el técnico "cuando puede"?**

Obliga al parte digital a marcar automáticamente hora de llegada (por geolocalización al abrir la ficha del vaso) y hora de cierre (al firmar). Sin esos dos timestamps, no hay medición fiable.

**¿Puedo asignar dinámicamente paradas entre técnicos según carga?**

Sí, y es el siguiente nivel. Requiere disponer de la matriz de tiempos entre todas las paradas y todos los técnicos, y una función objetivo (minimizar tiempo total, o equilibrar carga). Es un problema resoluble en segundos con un solver moderno; el cuello de botella es organizativo, no técnico.
`,
  },
  {
    slug: "whatsapp-clientes-piscinas-automatizacion",
    title:
      "WhatsApp con clientes de piscinas: qué automatizar y qué escalar siempre",
    description:
      "Guía práctica para empresas de mantenimiento de piscinas: qué mensajes de WhatsApp puede responder un agente automatizado, cuáles debe escalar a una persona y cómo evitar sonar a bot.",
    keywords: [
      "WhatsApp piscinas",
      "WhatsApp Business piscinas",
      "atención al cliente piscinas",
      "automatización WhatsApp mantenimiento",
      "agente virtual piscinas",
      "captación clientes piscinas",
    ],
    date: "2026-05-28",
    readingMinutes: 8,
    author: "Equipo Cloro",
    authorBio:
      "Equipo Cloro publica sobre operaciones, cumplimiento sanitario y digitalización en empresas de mantenimiento de piscinas en España.",
    tags: ["WhatsApp", "Atención al cliente", "Automatización"],
    cover: whatsappCover,
    coverAlt: "Portada del artículo sobre WhatsApp para empresas de piscinas",
    tldr:
      "WhatsApp es el canal preferido de administradores de fincas y propietarios de chalets en España, y también el que más tiempo consume. Un agente automatizado puede resolver bien confirmaciones, resultados de analíticas, próxima visita y precios. Debe escalar siempre a una persona reclamaciones, incidencias de agua turbia, quejas de olor y cualquier mención a niños o accidentes. La regla es simple: automatiza lo objetivo, escala lo emocional.",
    content: `## Por qué WhatsApp domina el mantenimiento de piscinas en España

En España, WhatsApp es el canal por defecto entre administradores de fincas, propietarios de chalets y equipos de mantenimiento. Las razones son las mismas de siempre: penetración total, coste cero para el cliente, respuestas inmediatas y ausencia de fricción de instalación.

Para la empresa de mantenimiento el resultado tiene dos caras. Por un lado, es el canal donde se cierran contratos y donde el cliente confía. Por otro, es donde más tiempo se pierde: el 60-70 % de las horas de coordinación de un jefe de operaciones acaban en un chat.

## Qué automatizar sin dudar

Cinco tipos de mensaje tienen respuesta objetiva y son terreno natural para un agente automatizado:

- **Confirmaciones de visita**. "Mañana pasamos entre 9:00 y 10:30." Un flujo automatizado con la agenda real del equipo evita 20 mensajes cruzados por semana.
- **Resultado de la última analítica**. Con acceso a la base de datos del SILOÉ interno, el agente resume: "Última analítica del 12 de junio: pH 7,4, cloro libre 1,1 mg/L. Todo dentro de rango."
- **Próxima visita programada**. Consulta directa a la ruta planificada.
- **Preguntas de precios estándar**. Tarifa de puesta a punto, precio de un vaciado, coste de una analítica extraordinaria.
- **Envío de documentación**. Última factura, contrato firmado, informe de laboratorio del mes.

Estos cinco flujos cubren, según nuestros datos internos, aproximadamente el **65 % del volumen de mensajes entrantes** en una empresa media de mantenimiento.

## Qué escalar siempre a una persona

Un bot que responde a mensajes sensibles es un cliente perdido. La regla es escalar de inmediato:

1. **Reclamaciones y quejas explícitas**. Cualquier mensaje que contenga "no estoy conforme", "es la tercera vez que", "voy a cambiar de empresa".
2. **Incidencias de agua turbia, verde o con olor**. Requieren diagnóstico técnico humano; una respuesta genérica agrava.
3. **Cualquier mención a niños o accidentes**. "Se ha resbalado el niño de la vecina", "hay un niño con eczema". Nunca respuesta automática.
4. **Solicitudes fuera de contrato**. Reparaciones de bomba, cambio de cuadro eléctrico, obras. El comercial cierra, no el bot.
5. **Solicitudes legales**. Petición de contrato, LOPD, seguros, siniestros.

El principio es simple: **automatiza lo objetivo, escala lo emocional o lo ambiguo**. Un buen agente sabe decir "te paso con Elena, del equipo, que te llama en menos de 30 minutos" y crea un ticket real detrás.

## Cómo evitar sonar a bot

Los tres errores que hacen que un agente de WhatsApp suene a robot barato son fáciles de evitar:

- **Frases genéricas sin datos del cliente**. Un mensaje que no incluye el nombre de la comunidad, la fecha exacta o el técnico asignado se percibe como plantilla.
- **Respuesta instantánea a las 3:41 de la madrugada**. Introduce un delay realista: 30-90 segundos en horario de oficina, y una respuesta explícita fuera ("Estamos fuera de horario, te respondemos mañana antes de las 10:00").
- **Cerrar la conversación sin pregunta**. Todo mensaje del bot debe acabar con una opción concreta: "¿Necesitas algo más?" o "¿Prefieres que te llame Elena?".

Ninguno de los tres es sofisticado. Todos se olvidan.

## Captación 24/7: donde el agente marca la diferencia

El caso de uso con mayor retorno no es la atención al cliente existente. Es la **captación de leads fuera de horario**. Un administrador de fincas que envía un mensaje a las 22:15 pidiendo presupuesto para tres comunidades espera respuesta al día siguiente. Si a los dos minutos recibe:

> "Hola Javier, soy el asistente de Cloro. Puedo agendarte una llamada de 15 minutos con nuestro comercial mañana entre las 10:00 y las 13:00. ¿Alguna franja te va bien?"

...la conversión sube significativamente. En nuestras métricas internas, el tiempo de primera respuesta a un lead entrante correlaciona más con la conversión que ninguna otra variable del funnel.

## Flujo tipo: cómo se ve una conversación real

Ejemplo de flujo mixto (agente + humano) que funciona bien:

**Cliente**: "¿Cuándo pasáis esta semana por Bloque B?"

**Agente**: "Hola Marta. La próxima visita a Piscina Comunitaria Bloque B está programada para el jueves 4 de julio entre las 9:00 y las 10:30. ¿Quieres que te avise 30 minutos antes?"

**Cliente**: "Sí, gracias. ¿Y podríais mirar el motor que hace ruido raro?"

**Agente**: "Anotado. Te paso con Elena, del equipo técnico, que te llama en menos de 30 minutos para diagnosticar antes de la visita."

Dos mensajes automatizados (datos objetivos), escalado limpio al detectar solicitud fuera de rutina. Sin dramatismo, sin fingir.

## Métricas que importan

Si vas a operar un canal de WhatsApp con agente, mide estas cuatro cosas y ninguna más:

| Métrica | Objetivo razonable |
| --- | --- |
| Tiempo primera respuesta | < 2 minutos en horario, < 12 h fuera |
| Tasa de resolución sin humano | 50-65 % del volumen |
| Tasa de escalado correcto | > 95 % (bot no rebota casos sensibles) |
| Satisfacción tras conversación | > 4,3 / 5 |

Todo lo demás es vanidad.

## Resumen

WhatsApp es donde la relación con el cliente vive y muere. Un agente bien diseñado libera al equipo humano de los flujos objetivos (confirmaciones, analíticas, precios) para que dedique tiempo a los flujos que exigen criterio (incidencias, ventas, reclamaciones). No es sustituir personas: es dejar de usar personas para copiar y pegar la misma respuesta 40 veces al día.

## FAQ

**¿Necesito la API oficial de WhatsApp Business?**

Sí, si quieres operar con un agente y varios operadores humanos sobre el mismo número sin bloqueos. La app móvil de WhatsApp Business sirve para volúmenes bajos y un solo operador.

**¿Un agente de WhatsApp cumple con RGPD?**

Sí, siempre que informes al cliente de que la conversación puede ser atendida por un sistema automatizado, del tratamiento de sus datos y del responsable. Un mensaje inicial claro y un enlace a la política de privacidad cubren la obligación.

**¿Cuánto tiempo se tarda en poner un agente en producción?**

Con un proveedor especializado y los flujos ya definidos, entre 2 y 4 semanas. El tiempo se va en integrar bien la agenda, el histórico de analíticas y el CRM, no en el bot en sí.

**¿Cuánto reduce el volumen de trabajo del equipo humano?**

Entre un 40 % y un 60 % del volumen entrante en empresas con más de 200 clientes activos. Por debajo de ese volumen el ROI cae y a veces no compensa.

**¿Puede el agente cerrar contratos por sí solo?**

Puede recopilar datos, enviar un contrato tipo y agendar la visita comercial. Cerrar el contrato firmado, en la práctica sigue requiriendo un humano al menos revisor. La regla que funciona: agente cierra visita, humano cierra contrato.

**¿Debería mi agente usar el nombre de una persona real?**

No. Los mejores agentes se presentan como "asistente de {marca}" y son transparentes desde el primer mensaje. Fingir que es una persona destruye confianza cuando se descubre, y siempre se descubre.
`,
  },
];

export function getPostBySlug(slug: string): BlogPost | undefined {
  return BLOG_POSTS.find((p) => p.slug === slug);
}
