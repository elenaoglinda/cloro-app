import { createFileRoute } from "@tanstack/react-router";
import { ComparisonPage } from "@/components/site/ComparisonPage";

const COMPETITOR = "EISI Hotel";
const URL_PATH = "/comparativa/eisi-hotel";

export const Route = createFileRoute("/comparativa/eisi-hotel")({
  head: () => ({
    meta: [
      { title: `Flipper vs ${COMPETITOR} — Comparativa de software de piscinas` },
      {
        name: "description",
        content:
          "Comparamos Flipper y EISI Hotel: cumplimiento SILOÉ, gestión de piscinas en hoteles y empresas de mantenimiento externas en España.",
      },
      { property: "og:title", content: `Flipper vs ${COMPETITOR}` },
      {
        property: "og:description",
        content:
          "Análisis honesto entre Flipper y EISI Hotel para piscinas de hoteles y empresas de mantenimiento.",
      },
      { property: "og:url", content: `https://flipper-app.lovable.app${URL_PATH}` },
      { property: "og:type", content: "article" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: `https://flipper-app.lovable.app${URL_PATH}` }],
  }),
  component: Page,
});

function Page() {
  return (
    <ComparisonPage
      competitorName={COMPETITOR}
      competitorTagline="Suite de gestión técnica para hoteles, con un módulo de control de piscinas y SPA."
      intro="EISI Hotel está diseñado para los servicios técnicos internos de un hotel: mantenimiento general, PRL, legionela y piscinas. Flipper está pensado para empresas de mantenimiento de piscinas que prestan servicio externo — incluyendo hoteles, comunidades y chalets — con rutas multi-cliente, facturación VeriFactu y atención por WhatsApp."
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
            { feature: "Generación de XML SILOÉ (Anexo IV)", flipper: true, competitor: true },
            { feature: "Validación en tiempo real de lecturas", flipper: true, competitor: true },
            { feature: "Histórico por vaso con fotos", flipper: true, competitor: true },
            { feature: "Plan de muestreo configurable", flipper: true, competitor: true },
          ],
        },
        {
          title: "Operativa multi-cliente",
          rows: [
            { feature: "Cartera de clientes con NIF y contactos múltiples", flipper: true, competitor: "partial", detail: "EISI Hotel está pensado para un solo establecimiento" },
            { feature: "Rutas semanales optimizadas por geografía", flipper: true, competitor: false },
            { feature: "Partes de trabajo facturables por visita", flipper: true, competitor: false },
            { feature: "Asignación de técnicos y cuadrantes", flipper: true, competitor: true },
            { feature: "Inventario de almacén central y furgonetas", flipper: true, competitor: "partial" },
          ],
        },
        {
          title: "Cliente y facturación",
          rows: [
            { feature: "Facturación electrónica VeriFactu", flipper: true, competitor: false },
            { feature: "Cobros recurrentes con Bizum, tarjeta y SEPA", flipper: true, competitor: false },
            { feature: "Portal del cliente para hoteles y administradores", flipper: true, competitor: "partial" },
            { feature: "Agente WhatsApp 24/7 para atender clientes", flipper: true, competitor: false },
            { feature: "Presupuestos y contratos de mantenimiento", flipper: true, competitor: "partial" },
          ],
        },
        {
          title: "Alcance del producto",
          rows: [
            { feature: "Foco específico en piscinas", flipper: true, competitor: "partial", detail: "EISI Hotel es una suite hotelera general" },
            { feature: "Mantenimiento general del edificio (PRL, técnico hotel)", flipper: false, competitor: true },
            { feature: "Implantación en menos de una semana", flipper: true, competitor: false },
            { feature: "Precio plano por técnico", flipper: true, competitor: false },
          ],
        },
      ]}
      bestFor={{
        flipper:
          "Eres una empresa que mantiene piscinas de varios hoteles, comunidades o chalets y necesitas rutas, facturación y atención al cliente unificadas.",
        competitor:
          "Eres el equipo técnico interno de un hotel y quieres una sola herramienta para gestionar mantenimiento general del edificio además de la piscina.",
      }}
      verdict="EISI Hotel encaja para el departamento técnico interno de un hotel. Si tu empresa presta el servicio de mantenimiento de piscinas a varios clientes — hoteles incluidos — Flipper te da rutas multi-cliente, facturación VeriFactu y un portal por cliente que EISI no está diseñado para cubrir."
    />
  );
}
