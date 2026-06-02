import { createFileRoute } from "@tanstack/react-router";
import { ComparisonPage } from "@/components/site/ComparisonPage";

const COMPETITOR = "EISI Hotel";
const URL_PATH = "/comparativa/eisi-hotel";

export const Route = createFileRoute("/comparativa/eisi-hotel")({
  head: () => ({
    meta: [
      { title: `Cloro vs ${COMPETITOR} — Comparativa de software de piscinas` },
      {
        name: "description",
        content:
          "Comparamos Cloro y EISI Hotel: cumplimiento SILOÉ, gestión de piscinas en hoteles y empresas de mantenimiento externas en España.",
      },
      { property: "og:title", content: `Cloro vs ${COMPETITOR}` },
      {
        property: "og:description",
        content:
          "Análisis honesto entre Cloro y EISI Hotel para piscinas de hoteles y empresas de mantenimiento.",
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
      competitorTagline="Suite de gestión técnica para hoteles, con un módulo de control de piscinas y SPA."
      intro="EISI Hotel está diseñado para los servicios técnicos internos de un hotel: mantenimiento general, PRL, legionela y piscinas. Cloro está pensado para empresas de mantenimiento de piscinas que prestan servicio externo — incluyendo hoteles, comunidades y chalets — con rutas multi-cliente, facturación VeriFactu y atención por WhatsApp."
      summary={[
        "Optimizado para empresas externas con múltiples clientes",
        "Rutas multi-cliente y partes facturables por visita",
        "Facturación VeriFactu y cobros recurrentes incluidos",
        "Portal del cliente para hoteles y administradores",
      ]}
      sections={[
        {
          title: "Cumplimiento sanitario",
          rows: [
            { feature: "Generación de XML SILOÉ (Anexo IV)", cloro: true, competitor: true },
            { feature: "Validación en tiempo real de lecturas", cloro: true, competitor: true },
            { feature: "Histórico por vaso con fotos", cloro: true, competitor: true },
            { feature: "Plan de muestreo configurable", cloro: true, competitor: true },
          ],
        },
        {
          title: "Operativa multi-cliente",
          rows: [
            { feature: "Cartera de clientes con NIF y contactos múltiples", cloro: true, competitor: "partial", detail: "EISI Hotel está pensado para un solo establecimiento" },
            { feature: "Rutas semanales optimizadas por geografía", cloro: true, competitor: false },
            { feature: "Partes de trabajo facturables por visita", cloro: true, competitor: false },
            { feature: "Asignación de técnicos y cuadrantes", cloro: true, competitor: true },
            { feature: "Inventario de almacén central y furgonetas", cloro: true, competitor: "partial" },
          ],
        },
        {
          title: "Cliente y facturación",
          rows: [
            { feature: "Facturación electrónica VeriFactu", cloro: true, competitor: false },
            { feature: "Cobros recurrentes con Bizum, tarjeta y SEPA", cloro: true, competitor: false },
            { feature: "Portal del cliente para hoteles y administradores", cloro: true, competitor: "partial" },
            { feature: "Agente WhatsApp 24/7 para atender clientes", cloro: true, competitor: false },
            { feature: "Presupuestos y contratos de mantenimiento", cloro: true, competitor: "partial" },
          ],
        },
        {
          title: "Alcance del producto",
          rows: [
            { feature: "Foco específico en piscinas", cloro: true, competitor: "partial", detail: "EISI Hotel es una suite hotelera general" },
            { feature: "Mantenimiento general del edificio (PRL, técnico hotel)", cloro: false, competitor: true },
            { feature: "Implantación en menos de una semana", cloro: true, competitor: false },
            { feature: "Precio plano por técnico", cloro: true, competitor: false },
          ],
        },
      ]}
      bestFor={{
        cloro:
          "Eres una empresa que mantiene piscinas de varios hoteles, comunidades o chalets y necesitas rutas, facturación y atención al cliente unificadas.",
        competitor:
          "Eres el equipo técnico interno de un hotel y quieres una sola herramienta para gestionar mantenimiento general del edificio además de la piscina.",
      }}
      verdict="EISI Hotel encaja para el departamento técnico interno de un hotel. Si tu empresa presta el servicio de mantenimiento de piscinas a varios clientes — hoteles incluidos — Cloro te da rutas multi-cliente, facturación VeriFactu y un portal por cliente que EISI no está diseñado para cubrir."
    />
  );
}
