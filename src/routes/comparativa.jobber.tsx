import { createFileRoute } from "@tanstack/react-router";
import { ComparisonPage } from "@/components/site/ComparisonPage";

const COMPETITOR = "Jobber";
const URL_PATH = "/comparativa/jobber";

export const Route = createFileRoute("/comparativa/jobber")({
  head: () => ({
    meta: [
      { title: `Cloro vs ${COMPETITOR} — Comparativa de software de piscinas` },
      {
        name: "description",
        content:
          "Comparamos Cloro y Jobber: SILOÉ, RD 742/2013, rutas, facturación con VeriFactu y agente WhatsApp para empresas de mantenimiento de piscinas en España.",
      },
      { property: "og:title", content: `Cloro vs ${COMPETITOR}` },
      {
        property: "og:description",
        content:
          "Análisis honesto entre Cloro y Jobber para empresas de mantenimiento de piscinas en España.",
      },
      { property: "og:url", content: `https://cloro.app${URL_PATH}` },
      { property: "og:type", content: "article" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: `https://cloro.app${URL_PATH}` }],
  }),
  component: Page,
});

function Page() {
  return (
    <ComparisonPage
      competitorName={COMPETITOR}
      competitorTagline="Software de gestión de servicios de campo para empresas de servicios a domicilio en Norteamérica."
      intro="Jobber es un software generalista muy completo para empresas de servicios a domicilio (jardinería, limpieza, climatización, piscinas…) pensado para Estados Unidos, Canadá, Reino Unido y Australia. Cloro está hecho para empresas de mantenimiento de piscinas en España: cubre el RD 742/2013 y el informe SILOÉ, factura con VeriFactu y atiende a tus clientes por WhatsApp."
      summary={[
        "SILOÉ y RD 742/2013 integrados, sin formularios a medida",
        "Facturación conectada con VeriFactu (AEAT)",
        "Toda la plataforma y el soporte en castellano",
        "Agente WhatsApp 24/7, el canal que usan tus clientes en España",
      ]}
      sections={[
        {
          title: "Cumplimiento sanitario",
          rows: [
            { feature: "Generación de XML SILOÉ (Anexo IV)", cloro: true, competitor: false },
            {
              feature: "Validación de lecturas fuera de rango del RD 742/2013",
              cloro: true,
              competitor: false,
            },
            {
              feature: "Registro de parámetros químicos por visita",
              cloro: true,
              competitor: "partial",
              detail: "En Jobber, con formularios personalizados sin validación",
            },
            {
              feature: "Histórico químico por vaso con trazabilidad",
              cloro: true,
              competitor: false,
            },
          ],
        },
        {
          title: "Operativa de campo",
          rows: [
            { feature: "App móvil para técnicos", cloro: true, competitor: true },
            {
              feature: "Trabajo sin cobertura",
              cloro: true,
              competitor: "partial",
              detail:
                "El modo offline de Jobber se limita a formularios, detalles de visita y tiempos",
            },
            { feature: "Optimización de rutas", cloro: true, competitor: true },
            {
              feature: "Visitas recurrentes y calendario del equipo",
              cloro: true,
              competitor: true,
            },
            { feature: "Partes con foto y firma del cliente", cloro: true, competitor: true },
          ],
        },
        {
          title: "Cliente y facturación",
          rows: [
            {
              feature: "Facturación conectada con VeriFactu (AEAT)",
              cloro: true,
              competitor: false,
              detail: "Jobber no está adaptado al sistema fiscal español",
            },
            {
              feature:
                "Facturas generadas desde los servicios realizados (mensual, puntual o anual)",
              cloro: true,
              competitor: true,
            },
            { feature: "Portal del cliente", cloro: true, competitor: true },
            {
              feature: "Agente WhatsApp 24/7",
              cloro: true,
              competitor: "partial",
              detail:
                "Jobber ofrece recepcionista IA por llamada y SMS; WhatsApp solo con integraciones de terceros",
            },
            {
              feature: "Presupuestos y cobros online con tarjeta",
              cloro: false,
              competitor: true,
              detail: "Jobber Payments está disponible en EE. UU., Canadá y Reino Unido",
            },
          ],
        },
        {
          title: "Implantación y precio",
          rows: [
            { feature: "Diseñado para la normativa española", cloro: true, competitor: false },
            {
              feature: "Plataforma completa en castellano",
              cloro: true,
              competitor: "partial",
              detail: "Jobber solo traduce la app móvil para usuarios no administradores",
            },
            {
              feature: "Soporte en castellano",
              cloro: true,
              competitor: "partial",
              detail: "Jobber tiene un equipo de soporte en español limitado",
            },
            {
              feature: "Planes en euros para autónomos y pymes",
              cloro: true,
              competitor: "partial",
              detail:
                "Jobber publica sus precios en dólares; la IA y el marketing son complementos de pago",
            },
          ],
        },
      ]}
      bestFor={{
        cloro:
          "Tu empresa hace mantenimiento de piscinas en España y necesitas cumplir el RD 742/2013, entregar el SILOÉ, facturar con VeriFactu y hablar con tus clientes por WhatsApp desde una sola herramienta en castellano.",
        competitor:
          "Operas en EE. UU., Canadá, Reino Unido o Australia, o combinas las piscinas con otros oficios (jardinería, limpieza…) y necesitas presupuestos y cobros online, sin requisitos de SILOÉ.",
      }}
      verdict="Jobber es una gran herramienta generalista para servicios a domicilio en Norteamérica, con presupuestos, cobros online y un ecosistema de integraciones muy amplio. Pero no conoce el RD 742/2013, no genera SILOÉ, no está adaptado a VeriFactu y no trabaja con WhatsApp de forma nativa. Si tu negocio es el mantenimiento de piscinas en España, Cloro te da todo eso de serie y en castellano."
    />
  );
}
