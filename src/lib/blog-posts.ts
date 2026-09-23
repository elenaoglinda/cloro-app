import rd742Cover from "@/assets/blog/rd-742.jpg";
import rutasCover from "@/assets/blog/rutas.jpg";
import whatsappCover from "@/assets/blog/whatsapp.jpg";
import softwareCover from "@/assets/blog/software.jpg";
import facturacionCover from "@/assets/blog/facturacion.jpg";

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

const AUTHOR = "Equipo Cloro";
const AUTHOR_BIO =
  "Equipo Cloro publica sobre operaciones, cumplimiento sanitario y digitalización en empresas de mantenimiento de piscinas en España.";

export const BLOG_POSTS: BlogPost[] = [
  {
    slug: "software-mantenimiento-piscinas-guia-completa",
    title:
      "Software para mantenimiento de piscinas: guía completa para empresas en España",
    description:
      "Qué debe hacer un software de mantenimiento de piscinas en 2026: partes digitales, rutas, cumplimiento del RD 742/2013 e informe SILOÉ. Comparativa frente a WhatsApp y Excel.",
    keywords: [
      "software mantenimiento piscinas",
      "app piscinas España",
      "gestión empresa mantenimiento piscinas",
      "SILOÉ",
      "digitalización mantenimiento piscinas",
    ],
    date: "2026-06-30",
    readingMinutes: 10,
    author: AUTHOR,
    authorBio: AUTHOR_BIO,
    tags: ["Software", "Digitalización", "Operaciones"],
    cover: softwareCover,
    coverAlt: "Ilustración de una app de mantenimiento de piscinas en el móvil",
    tldr:
      "La mayoría de empresas de mantenimiento de piscinas en España sigue trabajando con WhatsApp, Excel y papel, y eso provoca partes perdidos, incumplimientos del RD 742/2013 y facturación tarde. Cloro es el software específico para el sector: partes digitales desde el móvil, rutas optimizadas, informe SILOÉ automático y agente WhatsApp para clientes — todo conectado.",
    content: `## El problema real: WhatsApp, Excel y libretas

Si diriges una empresa de mantenimiento de piscinas en España, seguramente tu operativa se parece a esto: los técnicos apuntan lecturas en una libreta, mandan una foto por WhatsApp al terminar la visita, y alguien en oficina las pasa a Excel al día siguiente. La factura se hace a fin de mes, revisando conversaciones y hojas sueltas. Cuando llega Sanidad, se rezan las cuentas mientras se buscan los papeles.

Ese modelo funcionaba cuando llevabas diez piscinas. Con cincuenta ya no. Y con doscientas, es un riesgo diario.

Los problemas típicos que arrastra este flujo son siempre los mismos:

- **Datos perdidos.** Fotos de WhatsApp que se borran a los pocos meses, libretas que se mojan, empleados que se van con su móvil.
- **Registros no válidos ante Sanidad.** El RD 742/2013 exige un registro diario con parámetros concretos (cloro libre, cloro combinado, pH, turbidez, temperatura y aforo). Un WhatsApp o una foto de una libreta no cumplen ese requisito.
- **Técnicos llamando a oficina.** "¿Cuál era el cliente de las 11?", "¿Traigo el bidón de ácido?". Cada llamada es una piscina que espera.
- **Trabajo administrativo duplicado.** Alguien tiene que releer los partes del mes, cruzarlos con los contratos y volver a introducir la misma información en otras herramientas.
- **Disputas con comunidades.** "No pasasteis el martes." Sin firma ni geolocalización, la palabra del técnico contra la del presidente.

Cada uno de estos problemas se paga en horas de oficina, en requerimientos sanitarios y en clientes que se van sin avisar.

## Qué debe hacer un software específico para el sector

Un ERP genérico o un CRM adaptado *casi* sirve, pero siempre falla en lo mismo: no entiende piscinas. Un software especializado en mantenimiento de piscinas en España tiene que resolver, como mínimo, seis bloques:

| Bloque | Qué resuelve |
| --- | --- |
| Partes digitales | El técnico registra parámetros, dosificación de productos y firma del cliente desde el móvil, sin cobertura si hace falta. |
| Rutas | Asigna piscinas a técnicos por zona y calcula el orden óptimo del día. |
| Cumplimiento RD 742/2013 | Valida rangos, exige acción correctiva cuando algo se sale y guarda el historial completo. |
| SILOÉ | Genera el informe mensual con el formato que espera Sanidad, sin recomponerlo a mano. |
| Comunicación con el cliente | El presidente o administrador recibe el parte firmado al momento, sin llamar a oficina. |
| Seguimiento administrativo | Los partes quedan ordenados por cliente y fecha, sin volver a buscar datos en papeles o conversaciones. |

Sin esos seis bloques integrados, sigues teniendo silos: una cosa en la libreta, otra en el Excel, otra en el programa de facturación. Y los silos son exactamente el origen de los fallos que te cuestan dinero.

Si vienes de papel, merece la pena entender por qué [los partes de trabajo digitales cambian el día a día de un técnico frente al papel](/blog/partes-trabajo-piscinas-digitales-vs-papel) antes de comparar herramientas.

## Cloro: el software pensado específicamente para este sector en España

Cloro no es un CRM adaptado ni un ERP con módulo de piscinas. Está construido desde cero para empresas de mantenimiento de piscinas en España, y su alcance cubre los seis bloques anteriores en una sola aplicación:

- **Partes digitales desde el móvil.** El técnico abre la piscina en la app, mete cloro libre, cloro combinado, pH, turbidez, TAC, temperatura y aforo, apunta los productos dosificados y firma el cliente en el propio móvil. Si no hay cobertura, el parte se sincroniza al recuperarla.
- **Rutas optimizadas.** Cada mañana el técnico ve su ruta ordenada por eficiencia, no por el orden en que se dieron de alta las piscinas.
- **Informe SILOÉ automático.** A fin de mes el informe está generado con los datos reales y en el formato válido. No hay que recomponerlo desde Excel.
- **Agente WhatsApp para clientes.** Los presidentes y administradores reciben el parte firmado por WhatsApp automáticamente al terminar la visita, y pueden preguntar por el estado de su piscina sin llamarte.
- **Historial y trazabilidad.** Todo queda archivado el tiempo que exige la norma, con geolocalización, hora, técnico y firma. Ante un requerimiento de Sanidad se descarga en segundos.

Si tu problema principal son los partes dispersos, revisa [cómo digitalizar los partes de trabajo de piscinas frente al papel](/blog/partes-trabajo-piscinas-digitales-vs-papel) antes de elegir un flujo.

## Cómo saber si tu empresa está lista para dar el paso

Señales típicas de que ya vas tarde:

- Dedicas más de un día al mes a componer los SILOÉ de cada instalación.
- Has recibido al menos un requerimiento por datos incompletos o incoherentes.
- Facturar el mes te lleva más de dos días.
- Cuando un técnico se va, la información se va con él.
- Los presidentes te escriben por WhatsApp pidiendo el parte de la última visita.

Si te reconoces en tres o más, el problema ya no es de organización interna: es que tu operativa no escala con las herramientas que usas.

## Preguntas frecuentes

### ¿Un ERP genérico no me sirve?
Puede facturar y guardar clientes, pero no valida parámetros del RD 742/2013, no genera SILOÉ y no entiende de rutas de piscinas. Acabas montando parches en Excel.

### ¿Puedo migrar mis clientes desde una hoja de cálculo?
Sí. Cloro importa clientes, piscinas y contratos desde Excel o CSV en la puesta en marcha, sin volver a picar nada.

### ¿Los técnicos necesitan formación?
El parte se aprende en una visita. La app está diseñada para usarse con guantes y sol de mediodía, no en una oficina.

### ¿Qué pasa si un técnico está sin cobertura?
El parte se guarda en el móvil y se sincroniza automáticamente al recuperar señal. La firma del cliente sigue siendo válida.

---

Cloro es el software específico para empresas de mantenimiento de piscinas en España: partes digitales, rutas optimizadas, informe SILOÉ automático y agente WhatsApp. Todo en una sola aplicación, pensada para el técnico en el borde de la piscina y para la oficina que cierra el mes.
`,
  },

  {
    slug: "como-llevar-control-cloro-piscina-app",
    title:
      "Cómo llevar el control del cloro de una piscina desde una app (RD 742/2013)",
    description:
      "El control del cloro y el pH en libreta genera errores humanos e informes SILOÉ que no cuadran. Guía para registrar cloro libre, pH, TAC y turbidez desde el móvil cumpliendo el RD 742/2013.",
    keywords: [
      "control cloro piscina",
      "app cloro piscina",
      "registro pH piscina",
      "parámetros RD 742/2013",
      "control químico piscina móvil",
      "SILOÉ cloro",
    ],
    date: "2026-06-29",
    readingMinutes: 9,
    author: AUTHOR,
    authorBio: AUTHOR_BIO,
    tags: ["Cloro", "Química", "Cumplimiento"],
    cover: rd742Cover,
    coverAlt: "Portada del artículo sobre control de cloro con app móvil",
    tldr:
      "Apuntar cloro y pH en libreta y pasarlos luego a un Excel es la primera causa de informes SILOÉ que no cuadran con la realidad. Con Cloro, el técnico registra cloro libre, pH, TAC y turbidez desde el móvil en cada visita y el informe SILOÉ se genera solo cumpliendo el RD 742/2013.",
    content: `## El problema: cloro apuntado en libreta y transcrito al día siguiente

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

## Preguntas frecuentes

### ¿Puedo usar la app sin cobertura?
Sí. Los valores se guardan en local y se sincronizan al recuperar señal. La firma sigue siendo válida.

### ¿Reemplaza al fotómetro?
No. La medida sigue haciéndose con fotómetro o kit. La app sustituye la libreta y el Excel.

### ¿Sirve para instalaciones con varios vasos?
Sí. Cada vaso se registra por separado con su propio historial y sus propios rangos.

### ¿Los datos son válidos ante Sanidad?
Sí, si el registro incluye fecha, hora, técnico identificado y acción correctiva cuando procede. Cloro cumple los tres requisitos.

---

Con Cloro, el técnico registra cloro libre, pH, TAC y turbidez desde el móvil en cada visita. El informe SILOÉ se genera solo y cumple el RD 742/2013 sin trabajo extra.
`,
  },

  {
    slug: "partes-trabajo-piscinas-digitales-vs-papel",
    title:
      "Partes de trabajo digitales vs papel en mantenimiento de piscinas",
    description:
      "El parte en papel se pierde, se moja, se firma tarde y llega a facturación con retraso. Comparativa realista del día de un técnico con papel frente a partes de trabajo digitales enviados por WhatsApp.",
    keywords: [
      "partes de trabajo piscinas",
      "parte digital piscina",
      "app técnico piscinas",
      "firma digital cliente piscina",
      "parte piscina WhatsApp",
    ],
    date: "2026-06-28",
    readingMinutes: 9,
    author: AUTHOR,
    authorBio: AUTHOR_BIO,
    tags: ["Partes de trabajo", "Operaciones", "Digitalización"],
    cover: whatsappCover,
    coverAlt:
      "Portada del artículo sobre partes de trabajo digitales frente a papel",
    tldr:
      "El parte en papel se pierde, se firma tarde, dispara disputas con clientes y frena la facturación. Con Cloro, el técnico completa el parte desde el móvil, el cliente lo recibe firmado por WhatsApp y la empresa conserva el historial completo para cualquier inspección.",
    content: `## El día real de un técnico con partes en papel

El técnico llega a la primera piscina a las 8:15. Saca un talonario, apunta lecturas, dosifica y busca al conserje para que firme. El conserje no está. Deja el parte "para que lo firme más tarde" y se marcha. Repite el proceso once veces. A las 15:00 vuelve a base con doce papeles: dos manchados de cloro, uno sin firmar, dos con firma ilegible y uno perdido en el asiento del copiloto.

En oficina, alguien tiene que:

1. Descifrar la letra.
2. Reclamar las firmas que faltan.
3. Meter los datos en Excel.
4. Archivar el papel.
5. A fin de mes, montar la factura y el SILOÉ.

Multiplícalo por 3 técnicos y 22 días laborables. Estás hablando de **cientos de papeles al mes** que hay que tocar dos o tres veces.

Los efectos concretos:

- **Facturación tarde.** No puedes facturar servicios que aún no están firmados ni transcritos.
- **Disputas.** "Ese día no vinisteis." Sin firma con hora y geolocalización, es tu palabra contra la del presidente.
- **Datos perdidos.** Papel mojado, papel olvidado, papel que nunca llega.
- **Inspecciones lentas.** Sanidad pide el parte del 12 de junio y hay que buscarlo en un archivador.
- **Fuga de conocimiento.** Cuando el técnico se va, se lleva el historial en la cabeza.

## Qué hace exactamente un parte de trabajo digital

Un parte digital no es "escanear un PDF". Es un flujo completo:

- El técnico abre la piscina en el móvil y ve el histórico.
- Rellena los parámetros validados (cloro libre, combinado, pH, turbidez, temperatura, aforo).
- Registra los productos dosificados y las incidencias.
- Adjunta fotos si procede (filtro, vaso, incidencia).
- El cliente firma en la pantalla, con hora y geolocalización automáticas.
- El parte se envía automáticamente al cliente y se archiva en la nube.
- Los datos alimentan directamente el SILOÉ y la factura del mes.

El técnico no vuelve a base con papeles. La oficina no vuelve a transcribir nada.

## Comparativa real: papel vs digital

| Punto | Papel | Digital |
| --- | --- | --- |
| Tiempo por parte | 5–8 min con conserje presente, más búsqueda de firma | 2–3 min de principio a fin |
| Firma cliente | Depende de encontrar al conserje | En pantalla, cualquier persona autorizada |
| Envío al cliente | Copia carbón que a veces se entrega | Automático por WhatsApp o email al cerrar |
| Datos a oficina | Transcripción manual al día siguiente | En tiempo real, sin doble entrada |
| Cumplimiento RD 742/2013 | Depende de que el técnico rellene bien | Campos validados obligatorios |
| Búsqueda de parte antiguo | Archivador físico | Filtro por cliente y fecha, segundos |
| Riesgo de pérdida | Alto (papel se moja, se olvida) | Nulo (nube + histórico) |

## Beneficios que se notan la primera semana

- **Se factura antes.** Los partes están cerrados y firmados al terminar la visita. El día 1 del mes siguiente puedes facturar.
- **Bajan las disputas.** Firma + hora + coordenadas + foto. La visita es incontestable.
- **La ruta no se rompe.** El técnico no vuelve a base a entregar papeles.
- **SILOÉ automático.** No hay que recomponer nada a fin de mes.
- **Historia por piscina.** Sabes cuándo se cambió el filtro por última vez o cuándo el pH lleva dos semanas subiendo.

Si además quieres profesionalizar cómo registráis los parámetros químicos, empieza por [cómo llevar el control del cloro de una piscina desde una app](/blog/como-llevar-control-cloro-piscina-app). Y si estás evaluando dar el paso completo a una herramienta específica del sector, tienes la [guía completa de software de mantenimiento de piscinas](/blog/software-mantenimiento-piscinas-guia-completa).

## Objeciones típicas y por qué no se sostienen

- **"Mis técnicos son mayores y no van a saber usarlo."** El parte digital se aprende en una visita. Se diseña para usarse con guantes y bajo el sol.
- **"En algunas piscinas no hay cobertura."** El parte se guarda en el móvil y se sincroniza al recuperarla. La firma sigue teniendo validez.
- **"Mis clientes prefieren el papel."** Los clientes prefieren tener el parte inmediatamente en su móvil, sin llamar a nadie. Los que dicen preferir el papel es porque nunca han visto la alternativa.
- **"Cuesta dinero."** El coste mensual del software es menor que las horas de oficina que dedicas hoy a transcribir y perseguir firmas.

## Preguntas frecuentes

### ¿La firma en pantalla tiene validez?
Sí. Con geolocalización, hora y trazabilidad de quién firma, es una prueba documental más sólida que una firma en papel.

### ¿Puedo seguir emitiendo copia al cliente?
Sí. El cliente recibe el parte automáticamente por WhatsApp o email al cerrarse.

### ¿Y las incidencias que hoy escribo a mano?
Se registran como texto libre en el parte digital y quedan asociadas a la piscina y a la fecha.

### ¿Puedo exportar los partes para una inspección?
Sí. Filtras por cliente, piscina y periodo, y descargas un PDF con todos los partes firmados.

---

Cloro elimina el papel por completo: el técnico completa el parte desde el móvil, el cliente lo recibe firmado por WhatsApp y tú conservas el historial para cualquier inspección.
`,
  },

  {
    slug: "normativa-piscinas-comunitarias-espana-2025",
    title:
      "Normativa de piscinas comunitarias en España en 2025 (RD 742/2013)",
    description:
      "Qué exige el RD 742/2013 a las piscinas comunitarias en España en 2025: parámetros, analíticas, SILOÉ, conservación documental, responsabilidades del presidente y de la empresa de mantenimiento.",
    keywords: [
      "normativa piscinas comunitarias",
      "RD 742/2013 comunidades",
      "piscina comunidad propietarios ley",
      "responsabilidad presidente comunidad piscina",
      "inspección sanitaria piscina",
    ],
    date: "2026-06-27",
    readingMinutes: 11,
    author: AUTHOR,
    authorBio: AUTHOR_BIO,
    tags: ["Normativa", "Comunidades", "RD 742/2013"],
    cover: rutasCover,
    coverAlt:
      "Portada del artículo sobre normativa de piscinas comunitarias en España",
    tldr:
      "En 2025 las piscinas de comunidades de propietarios en España siguen sujetas al RD 742/2013 y a la normativa autonómica que lo desarrolla. El titular (la comunidad) responde legalmente, pero delega la ejecución en la empresa de mantenimiento. Cloro está diseñado específicamente para cumplir el RD 742/2013 y hacer que la comunidad y la empresa vayan sobre seguro ante cualquier inspección.",
    content: `## Por qué esto va en serio: el titular responde, aunque delegue

En una piscina comunitaria hay dos figuras que muchos administradores confunden:

- **Titular de la piscina.** La comunidad de propietarios. Es quien responde legalmente ante Sanidad.
- **Empresa de mantenimiento.** Quien ejecuta el control diario, la dosificación y las analíticas. Responde ante la comunidad, no directamente ante Sanidad.

Este matiz importa porque, cuando llega un requerimiento o una sanción, va dirigido al titular. El presidente de la comunidad puede alegar que contrató a una empresa profesional, pero la responsabilidad final no desaparece con el contrato: se comparte.

Por eso, cuando la empresa de mantenimiento entrega registros incompletos o cuando el SILOÉ no cuadra, la comunidad se expone. Y cuando la comunidad se expone, la empresa pierde el cliente al año siguiente.

## Qué exige el RD 742/2013 a una piscina comunitaria

El marco de referencia sigue siendo el **RD 742/2013** de criterios técnico-sanitarios, complementado con la normativa autonómica (cada comunidad autónoma añade requisitos y frecuencias). Los mínimos aplicables a una piscina comunitaria son:

| Bloque | Obligación |
| --- | --- |
| Registro diario | Cloro libre, cloro combinado, pH, turbidez, temperatura y aforo durante el horario de apertura. |
| Analíticas de laboratorio | Analítica mensual en laboratorio acreditado ENAC, con parámetros microbiológicos y físico-químicos. |
| SILOÉ | Alta de la piscina en el sistema autonómico y carga periódica de los datos exigidos. |
| Cartelería | Reglamento interno visible, aforo, profundidades, teléfonos de emergencia. |
| Socorrismo | Según aforo y tipología, con el detalle que fije la comunidad autónoma. |
| Conservación documental | Registros y analíticas durante el periodo que exige la norma (habitualmente varias temporadas). |

El detalle específico de las lecturas diarias y de qué hacer cuando un valor se sale de rango lo tienes en [cómo llevar el control del cloro de una piscina desde una app](/blog/como-llevar-control-cloro-piscina-app).

## Qué pasa en una inspección real

La inspección de Sanidad, en la práctica, es un procedimiento bastante mecánico:

1. Comprueba la cartelería y el estado visual del vaso.
2. Pide el registro de los últimos meses (parámetros diarios).
3. Pide las analíticas de laboratorio.
4. Contrasta lo registrado en SILOÉ con lo que hay en papel/pantalla.
5. Toma muestra propia si lo estima.

Los tres motivos más habituales de requerimiento son siempre los mismos:

- Días sin lectura registrada.
- Valores fuera de rango sin acción correctiva registrada.
- Analíticas o cargas en SILOÉ fuera de plazo.

Ninguno de los tres es "un problema del agua". Los tres son problemas de **registro**. Y todos se evitan con un flujo digital riguroso.

## Cómo se reparte la responsabilidad práctica

En el contrato entre comunidad y empresa de mantenimiento conviene dejar claro:

- Frecuencia mínima de visitas del técnico.
- Quién asume la carga en SILOÉ.
- Quién contrata el laboratorio ENAC.
- Cómo se comunica al presidente cualquier incidencia.
- Dónde se archivan los registros y quién puede acceder.

Si la comunidad no exige registros digitales, muchas empresas siguen entregando fotocopias de libretas al año siguiente. Eso, ante una inspección seria, no basta.

Si necesitas entender de dónde vienen esas obligaciones y qué hace el software para automatizarlas, la [guía completa de software de mantenimiento de piscinas](/blog/software-mantenimiento-piscinas-guia-completa) explica el mapa completo.

## Errores frecuentes en comunidades

- **Delegar sin verificar.** El administrador firma con la empresa y no vuelve a pedir informes hasta que llega un problema.
- **Confundir "tener contrato" con "estar en regla".** El contrato demuestra que hay servicio contratado, no que se ha ejecutado bien cada día.
- **No conservar el histórico.** Cuando cambia la empresa de mantenimiento, la comunidad se queda sin los registros del año anterior.
- **Ignorar la normativa autonómica.** El RD 742/2013 es el mínimo; cada autonomía añade requisitos concretos (frecuencias, socorristas, avisos).

## Cómo Cloro reduce el riesgo real

Cloro está diseñado específicamente para cumplir el RD 742/2013 y facilitar la vida a la empresa de mantenimiento y a la comunidad:

- Registra los parámetros obligatorios en cada visita, con validación de rangos y acción correctiva obligatoria si algo se sale.
- Genera el informe SILOÉ en el formato válido, con los datos reales del mes.
- Almacena el historial completo durante el tiempo que exige la norma, con trazabilidad de técnico, hora y firma.
- Permite compartir con el presidente o el administrador un acceso de solo lectura, para que puedan ver los partes sin llamar a la empresa.
- Deja preparada la documentación que Sanidad pide en una inspección, descargable en segundos.

## Preguntas frecuentes

### ¿Aplica a mi comunidad si la piscina es solo para vecinos?
Sí. La normativa considera pública toda piscina con más de un usuario que no sea unifamiliar de uso exclusivo.

### ¿La empresa de mantenimiento es responsable si hay sanción?
La responsabilidad legal es del titular (la comunidad), pero puede repercutirse contractualmente si hay negligencia demostrable.

### ¿Cuánto tiempo hay que conservar los registros?
Como norma general, varias temporadas; consulta la normativa autonómica aplicable para el plazo exacto.

### ¿Puedo llevar todo en papel y ya está?
Puedes, pero te expones a errores humanos, pérdida de documentos y a que Sanidad no acepte registros ilegibles o incompletos.

---

Cloro está diseñado específicamente para cumplir el RD 742/2013: registra los parámetros obligatorios en cada visita, genera el informe SILOÉ y almacena el historial durante el tiempo que exige la norma.
`,
  },

  {
    slug: "como-organizar-partes-mantenimiento-piscinas",
    title: "Cómo organizar los partes de mantenimiento de piscinas sin perder horas",
    description:
      "Guía práctica para ordenar partes, visitas y documentación de piscinas sin depender de papel, WhatsApp y hojas de cálculo dispersas.",
    keywords: [
      "organizar partes mantenimiento piscinas",
      "gestión partes piscinas",
      "digitalizar empresa piscinas",
      "software partes piscinas",
      "control visitas piscinas",
    ],
    date: "2026-06-26",
    readingMinutes: 8,
    author: AUTHOR,
    authorBio: AUTHOR_BIO,
    tags: ["Partes", "Operaciones", "Digitalización"],
    cover: facturacionCover,
    coverAlt: "Portada del artículo sobre organización de partes de mantenimiento de piscinas",
    tldr:
      "Los partes en papel y los mensajes sueltos hacen perder información y horas de oficina. Cloro centraliza cada visita, lectura, foto y firma para que el historial de cada piscina esté siempre completo y listo para consultar.",
    content: `## El problema: cerrar la semana buscando papeles

En una empresa de mantenimiento de piscinas, la información suele quedar repartida entre libretas, fotos enviadas por WhatsApp y hojas de cálculo. Cuando un cliente pregunta por una visita o llega el momento de preparar el informe SILOÉ, alguien tiene que reconstruir lo ocurrido.

Ese sistema puede funcionar con pocas piscinas. Cuando crecen la cartera y el equipo, aparecen los mismos problemas:

- **Partes perdidos o ilegibles.** El papel se moja, se extravía o llega tarde a la oficina.
- **Datos duplicados.** Una lectura se apunta primero a mano y después se vuelve a introducir en Excel.
- **Falta de trazabilidad.** No siempre queda claro quién hizo la visita, a qué hora o qué producto aplicó.
- **Respuestas lentas al cliente.** Encontrar el último parte exige revisar conversaciones y carpetas.

## Qué debe contener un parte bien organizado

| Dato | Por qué importa |
| --- | --- |
| Fecha, hora y técnico | Permite demostrar cuándo se realizó la visita. |
| Lecturas químicas | Mantiene el historial de cloro, pH, turbidez y temperatura. |
| Productos aplicados | Deja constancia de dosis, cantidades y acciones correctivas. |
| Fotos y firma | Aporta evidencia del estado de la piscina y del servicio. |
| Observaciones | Facilita el seguimiento de incidencias en la siguiente visita. |

Toda esta información debe quedar unida a la piscina correcta. Guardar una parte en papel, otra en el móvil del técnico y otra en una hoja de cálculo crea huecos que después cuestan tiempo y credibilidad.

## Cómo pasar del papel a un flujo digital

El cambio no consiste solo en sustituir una libreta por una pantalla. El objetivo es que el dato se registre una vez y sirva para todo el proceso.

1. El técnico abre la piscina asignada desde su ruta diaria.
2. Introduce las lecturas y los productos aplicados.
3. Añade fotos, observaciones y la firma del cliente.
4. El parte queda guardado en el historial de la instalación.
5. La oficina puede consultar la visita sin pedir fotos ni transcribir datos.
6. Los registros quedan preparados para generar el informe SILOÉ.

Si todavía recibes fotografías de formularios manuales, también puedes digitalizarlas. Cloro extrae la información del parte fotografiado y la organiza antes de incorporarla al informe. Así puedes migrar de forma gradual sin perder el trabajo ya realizado.

Para entender qué datos exige la normativa, consulta la [guía del RD 742/2013 para piscinas comunitarias](/blog/normativa-piscinas-comunitarias-espana-2025). Si quieres comparar el trabajo diario, revisa también [partes digitales frente a partes en papel](/blog/partes-trabajo-piscinas-digitales-vs-papel).

## Cómo ayuda Cloro

Cloro reúne la operación diaria de la empresa en un único lugar:

- Rutas optimizadas para cada técnico.
- Partes digitales con lecturas, fotos y firma.
- Importación de partes manuales mediante una fotografía.
- Historial completo por cliente y piscina.
- Alertas cuando una lectura está fuera de rango.
- Generación del informe SILOÉ en Excel por vaso.
- Comunicación con clientes desde WhatsApp.

El resultado es sencillo: el técnico termina la visita y la oficina ya tiene la información. No hay que esperar al viernes, perseguir libretas ni volver a escribir los mismos datos.

## Preguntas frecuentes

### ¿Puedo empezar aunque todavía use partes en papel?
Sí. Puedes fotografiar los partes existentes, revisar los datos extraídos y pasar gradualmente al registro digital desde el móvil.

### ¿Funciona si el técnico no tiene cobertura?
Sí. El parte puede guardarse durante la visita y sincronizarse cuando vuelva la conexión.

### ¿Puedo encontrar todos los partes de una piscina?
Sí. Cada piscina conserva su historial de visitas, lecturas, fotos, observaciones y firmas.

### ¿Los datos sirven para preparar SILOÉ?
Sí. Cloro organiza los registros por piscina y genera el Excel correspondiente para su revisión y entrega.

---

Si quieres dejar de reconstruir visitas desde papeles y mensajes, prueba Cloro con una ruta real. Registra un parte o fotografía uno manual y comprueba cómo queda todo el historial preparado para SILOÉ.
`,
  },
];

export function getPostBySlug(slug: string): BlogPost | undefined {
  return BLOG_POSTS.find((p) => p.slug === slug);
}
