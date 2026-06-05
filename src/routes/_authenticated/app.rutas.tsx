import { createFileRoute, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Plus, MapPin } from "lucide-react";
import { toast } from "sonner";
import { listRutas, createRuta } from "@/lib/rutas.functions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export const Route = createFileRoute("/_authenticated/app/rutas")({
  component: RutasPage,
});

function RutasPage() {
  const qc = useQueryClient();
  const listFn = useServerFn(listRutas);
  const createFn = useServerFn(createRuta);
  const { data } = useQuery({ queryKey: ["rutas"], queryFn: () => listFn() });
  const [open, setOpen] = useState(false);
  const [nombre, setNombre] = useState("");
  const [fecha, setFecha] = useState(() => new Date().toISOString().slice(0, 10));

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    try {
      await createFn({ data: { nombre: nombre.trim(), fecha, notas: null } });
      toast.success("Ruta creada");
      setOpen(false); setNombre("");
      qc.invalidateQueries({ queryKey: ["rutas"] });
    } catch (err: any) {
      toast.error(err.message);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Rutas</h1>
        <Button size="sm" onClick={() => setOpen((v) => !v)}>
          <Plus className="size-4 mr-1" /> Nueva
        </Button>
      </div>

      {open && (
        <form onSubmit={submit} className="bg-card border border-border rounded-lg p-4 flex flex-col sm:flex-row gap-2">
          <Input placeholder="Nombre de la ruta" value={nombre} onChange={(e) => setNombre(e.target.value)} required />
          <Input type="date" value={fecha} onChange={(e) => setFecha(e.target.value)} required />
          <Button type="submit">Crear</Button>
        </form>
      )}

      {!data?.rutas.length ? (
        <div className="text-center py-16 text-muted-foreground">
          <MapPin className="size-10 mx-auto mb-3 opacity-40" />
          <p className="text-sm">Aún no tienes rutas planificadas.</p>
        </div>
      ) : (
        <div className="bg-card border border-border rounded-lg divide-y divide-border/60">
          {data.rutas.map((r: any) => {
            const total = r.ruta_paradas?.length ?? 0;
            const done = r.ruta_paradas?.filter((p: any) => p.completada).length ?? 0;
            return (
              <Link key={r.id} to="/app/rutas/$id" params={{ id: r.id }} className="flex items-center justify-between p-4 hover:bg-muted/40 transition">
                <div>
                  <div className="font-medium">{r.nombre}</div>
                  <div className="text-xs text-muted-foreground">{new Date(r.fecha).toLocaleDateString("es-ES")}</div>
                </div>
                <div className="text-sm text-muted-foreground">{done}/{total} paradas</div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
