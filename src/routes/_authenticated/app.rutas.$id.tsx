import { createFileRoute, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, Plus, Trash2, Check, Navigation, ExternalLink, Sparkles, ChevronDown } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { getRuta, addParada, toggleParada, removeParada, deleteRuta, optimizeRuta } from "@/lib/rutas.functions";
import { listPiscinas } from "@/lib/piscinas.functions";
import { Button } from "@/components/ui/button";
import { RutaMap, type RutaMapStop } from "@/components/app/RutaMap";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";


export const Route = createFileRoute("/_authenticated/app/rutas/$id")({
  component: RutaDetail,
});

function RutaDetail() {
  const { id } = Route.useParams();
  const qc = useQueryClient();
  const getFn = useServerFn(getRuta);
  const piscinasFn = useServerFn(listPiscinas);
  const addFn = useServerFn(addParada);
  const toggleFn = useServerFn(toggleParada);
  const removeFn = useServerFn(removeParada);
  const deleteFn = useServerFn(deleteRuta);
  const optimizeFn = useServerFn(optimizeRuta);

  const { data } = useQuery({ queryKey: ["ruta", id], queryFn: () => getFn({ data: { id } }) });
  const { data: pData } = useQuery({ queryKey: ["piscinas-all"], queryFn: () => piscinasFn() });
  
  const [polyline, setPolyline] = useState<string | null>(null);
  const [optimizing, setOptimizing] = useState(false);

  async function add(piscina_id: string) {
    try {
      await addFn({ data: { ruta_id: id, piscina_id } });
      await qc.invalidateQueries({ queryKey: ["ruta", id] });
      toast.success("Piscina añadida a la ruta");
    } catch (err: any) {
      toast.error("Error al añadir la piscina", { description: err?.message });
    }
  }
  async function toggle(pid: string, completada: boolean) {
    await toggleFn({ data: { id: pid, completada } });
    qc.invalidateQueries({ queryKey: ["ruta", id] });
  }
  async function remove(pid: string) {
    await removeFn({ data: { id: pid } });
    qc.invalidateQueries({ queryKey: ["ruta", id] });
  }
  async function killRuta() {
    if (!confirm("¿Eliminar la ruta?")) return;
    await deleteFn({ data: { id } });
    toast.success("Ruta eliminada");
    window.location.href = "/app/rutas";
  }
  async function optimize() {
    setOptimizing(true);
    try {
      const res = await optimizeFn({ data: { id } });
      setPolyline(res.polyline ?? null);
      await qc.invalidateQueries({ queryKey: ["ruta", id] });
      const km = res.distanceMeters ? (res.distanceMeters / 1000).toFixed(1) : null;
      toast.success(km ? `Ruta optimizada · ${km} km` : "Ruta optimizada");
    } catch (err: any) {
      toast.error(err?.message || "No se pudo optimizar");
    } finally {
      setOptimizing(false);
    }
  }

  if (!data) return <p className="text-sm text-muted-foreground">Cargando...</p>;
  const used = new Set(data.paradas.map((p: any) => p.piscina_id));
  const mapStops: RutaMapStop[] = data.paradas.map((p: any) => ({
    paradaId: p.id,
    piscinaId: p.piscina_id,
    alias: p.piscinas?.alias ?? "",
    cliente: p.piscinas?.clientes?.nombre ?? "",
    direccion: p.piscinas?.direccion ?? null,
    lat: p.piscinas?.lat != null ? Number(p.piscinas.lat) : null,
    lng: p.piscinas?.lng != null ? Number(p.piscinas.lng) : null,
  }));
  const geolocCount = mapStops.filter(
    (s) => (s.lat != null && s.lng != null) || (s.direccion && s.direccion.trim().length > 0),
  ).length;

  const gmapsHref = (p: any) =>
    p.piscinas?.lat != null
      ? `https://www.google.com/maps/dir/?api=1&destination=${p.piscinas.lat},${p.piscinas.lng}`
      : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(p.piscinas?.direccion ?? "")}`;
  const wazeHref = (p: any) =>
    p.piscinas?.lat != null
      ? `https://waze.com/ul?ll=${p.piscinas.lat},${p.piscinas.lng}&navigate=yes`
      : `https://waze.com/ul?q=${encodeURIComponent(p.piscinas?.direccion ?? "")}&navigate=yes`;

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <Link to="/app/rutas" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="size-4 mr-1" /> Rutas
      </Link>
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-semibold">{data.ruta.nombre}</h1>
          <p className="text-sm text-muted-foreground">{new Date(data.ruta.fecha).toLocaleDateString("es-ES")}</p>
        </div>
        <Button variant="ghost" size="sm" onClick={killRuta}><Trash2 className="size-4" /></Button>
      </div>

      {mapStops.length > 0 && (
        <div className="space-y-2">
          <RutaMap stops={mapStops} polyline={polyline} />
          <div className="flex justify-between items-center">
            <p className="text-xs text-muted-foreground">
              {geolocCount} de {data.paradas.length} paradas con dirección
            </p>
            <Button size="sm" variant="outline" onClick={optimize} disabled={optimizing || mapStops.length < 3}>
              <Sparkles className="size-4 mr-1" />
              {optimizing ? "Optimizando..." : "Optimizar ruta"}
            </Button>
          </div>
        </div>
      )}

      <div className="bg-card border border-border rounded-lg">
        <div className="flex items-center justify-between gap-2 p-4 border-b border-border">
          <h2 className="text-sm font-semibold">Paradas</h2>
          {(() => {
            const available = pData?.piscinas.filter((p: any) => !used.has(p.id)) ?? [];
            return (
              <Popover>
                <PopoverTrigger asChild>
                  <Button size="sm" variant="outline" disabled={!available.length}>
                    <Plus className="size-4 mr-1" />
                    {available.length ? "Añadir piscina" : "Sin piscinas"}
                    <ChevronDown className="size-4 ml-1 opacity-60" />
                  </Button>

                </PopoverTrigger>
                <PopoverContent align="end" className="p-0 w-[280px]">
                  <Command>
                    <CommandInput placeholder="Buscar piscina..." />
                    <CommandList className="max-h-[60vh]">
                      <CommandEmpty>Sin resultados.</CommandEmpty>
                      <CommandGroup>
                        {available.map((p: any) => (
                          <CommandItem
                            key={p.id}
                            value={`${p.alias} ${p.clientes?.nombre ?? ""}`}
                            onSelect={() => add(p.id)}
                          >
                            {p.alias} — {p.clientes?.nombre}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            );
          })()}
        </div>



        {!data.paradas.length ? (
          <p className="p-4 text-sm text-muted-foreground">Sin paradas. Añade piscinas a la ruta.</p>
        ) : (
          <ul className="divide-y divide-border/60">
            {data.paradas.map((p: any, idx: number) => (
              <li key={p.id} className="flex items-center gap-3 p-4">
                <button
                  onClick={() => toggle(p.id, !p.completada)}
                  className={`size-7 rounded-full border-2 flex items-center justify-center shrink-0 ${
                    p.completada ? "bg-primary border-primary text-primary-foreground" : "border-border"
                  }`}
                >
                  {p.completada && <Check className="size-4" />}
                </button>
                <div className="flex-1 min-w-0">
                  <div className={`text-sm font-medium truncate ${p.completada ? "line-through text-muted-foreground" : ""}`}>
                    {idx + 1}. {p.piscinas?.alias} · {p.piscinas?.clientes?.nombre}
                  </div>
                  {p.piscinas?.direccion && (
                    <div className="text-xs text-muted-foreground truncate">{p.piscinas.direccion}</div>
                  )}
                  <div className="flex gap-3 mt-1">
                    <a href={gmapsHref(p)} target="_blank" rel="noreferrer" className="text-xs text-primary inline-flex items-center gap-1 hover:underline">
                      <ExternalLink className="size-3" /> Google Maps
                    </a>
                    <a href={wazeHref(p)} target="_blank" rel="noreferrer" className="text-xs text-primary inline-flex items-center gap-1 hover:underline">
                      <Navigation className="size-3" /> Waze
                    </a>
                  </div>
                </div>
                <Button variant="ghost" size="sm" onClick={() => remove(p.id)}>
                  <Trash2 className="size-4" />
                </Button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
