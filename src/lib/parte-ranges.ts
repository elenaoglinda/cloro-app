// Rangos de referencia RD 742/2013
export type Estado = "ok" | "alerta" | "critico" | "neutro";

export const dotClass: Record<Estado, string> = {
  ok: "bg-emerald-500",
  alerta: "bg-amber-500",
  critico: "bg-red-500",
  neutro: "bg-muted-foreground/40",
};

export const textClass: Record<Estado, string> = {
  ok: "text-emerald-600 dark:text-emerald-400",
  alerta: "text-amber-600 dark:text-amber-400",
  critico: "text-red-600 dark:text-red-400",
  neutro: "text-muted-foreground",
};

const between = (v: number, a: number, b: number) => v >= a && v <= b;

export function evalPh(v: number | null | undefined): Estado {
  if (v == null || isNaN(v as number)) return "neutro";
  if (between(v, 7.2, 8.0)) return "ok";
  if (between(v, 6.0, 9.0)) return "alerta";
  return "critico";
}
export function evalCloroLibre(v: number | null | undefined): Estado {
  if (v == null || isNaN(v as number)) return "neutro";
  if (v === 0 || v > 5) return "critico";
  if (between(v, 0.5, 2.0)) return "ok";
  if (v > 2.0 && v <= 5.0) return "alerta";
  return "alerta"; // < 0.5 pero > 0
}
export function evalCloroCombinado(v: number | null | undefined): Estado {
  if (v == null || isNaN(v as number)) return "neutro";
  if (v <= 0.6) return "ok";
  if (v <= 1.0) return "alerta";
  return "critico";
}
export function evalTurbidez(v: number | null | undefined): Estado {
  if (v == null || isNaN(v as number)) return "neutro";
  if (v <= 5) return "ok";
  if (v <= 20) return "alerta";
  return "critico";
}
export function evalTransparencia(v: boolean | null | undefined): Estado {
  if (v == null) return "neutro";
  return v ? "ok" : "critico";
}
export function evalTemperatura(v: number | null | undefined): Estado {
  if (v == null || isNaN(v as number)) return "neutro";
  if (v > 40) return "critico";
  if (between(v, 24, 30)) return "ok";
  return "neutro";
}

export function cloroCombinado(libre: number | null | undefined, total: number | null | undefined): number | null {
  if (libre == null || total == null) return null;
  const v = Number(total) - Number(libre);
  if (isNaN(v)) return null;
  return Math.max(0, Math.round(v * 100) / 100);
}

export function semaforoParte(p: {
  ph?: number | null;
  cloro_libre?: number | null;
  cloro_total?: number | null;
  turbidez?: number | null;
  transparencia_fondo?: boolean | null;
  temp_c?: number | null;
}): Estado {
  const estados: Estado[] = [
    evalPh(p.ph),
    evalCloroLibre(p.cloro_libre),
    evalCloroCombinado(cloroCombinado(p.cloro_libre, p.cloro_total)),
    evalTurbidez(p.turbidez),
    evalTransparencia(p.transparencia_fondo),
    evalTemperatura(p.temp_c),
  ];
  if (estados.includes("critico")) return "critico";
  if (estados.includes("alerta")) return "alerta";
  if (estados.every((e) => e === "neutro")) return "neutro";
  return "ok";
}
