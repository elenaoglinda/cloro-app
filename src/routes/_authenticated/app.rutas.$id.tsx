import { createFileRoute, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, Plus, Trash2, Check } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { getRuta, addParada, toggleParada, removeParada, deleteRuta } from "@/lib/rutas.functions";
import { listPiscinas } from "@/lib/piscinas.functions";
import { Button } from "@/components/ui/button";

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

  const { data } = useQuery({ queryKey: ["ruta", id], queryFn: () => getFn({ data: { id } }) });
  const { data: pData } = useQuery({ queryKey: ["piscinas-all"], queryFn: () => piscinasFn() });
  const [picker, setPicker] = useState(false);

  async function add(piscina_id: string) {
    try {
      await addFn({ data: { ruta_id: id, piscina_id } });
      setPicker(false);
      await qc.invalidateQueries({ queryKey: ["ruta", id] });
      toast.success("Parada añadida");
    } catch (err: any) {
      console.error("addParada error", err);
      toast.error(err?.message || "No se pudo añadir la parada");
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

  if (!data) return <p className="text-sm text-muted-foreground">Cargando...</p>;
  const used = new Set(data.paradas.map((p: any) => p.piscina_id));

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

      <div className="bg-card border border-border rounded-lg">
        <div className="flex items-center justify-between p-4 border-b border-border">
          <h2 className="text-sm font-semibold">Paradas</h2>
          <Button size="sm" variant="outline" onClick={() => setPicker((v) => !v)}>
            <Plus className="size-4 mr-1" /> Añadir piscina
          </Button>
        </div>

        {picker && (
          <div className="max-h-64 overflow-auto border-b border-border">
            {pData?.piscinas.filter((p: any) => !used.has(p.id)).map((p: any) => (
              <button key={p.id} onClick={() => add(p.id)} className="w-full text-left px-4 py-2 text-sm hover:bg-muted">
                <span className="font-medium">{p.alias}</span>{" "}
                <span className="text-muted-foreground">— {p.clientes?.nombre}</span>
              </button>
            ))}
            {!pData?.piscinas.filter((p: any) => !used.has(p.id)).length && (
              <p className="p-4 text-sm text-muted-foreground">No quedan piscinas por añadir.</p>
            )}
          </div>
        )}

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
