import { createFileRoute, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Plus, ArrowLeft, Droplets } from "lucide-react";
import { getCliente } from "@/lib/clientes.functions";
import { upsertPiscina } from "@/lib/piscinas.functions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter,
} from "@/components/ui/dialog";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/app/clientes/$id")({
  component: ClienteDetail,
});

function ClienteDetail() {
  const { id } = Route.useParams();
  const fn = useServerFn(getCliente);
  const create = useServerFn(upsertPiscina);
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ alias: "", tipo: "", volumen_m3: "", direccion: "" });
  const { data, isLoading } = useQuery({ queryKey: ["cliente", id], queryFn: () => fn({ data: { id } }) });

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    try {
      await create({
        data: {
          values: {
            cliente_id: id,
            alias: form.alias,
            tipo: form.tipo || null,
            volumen_m3: form.volumen_m3 ? Number(form.volumen_m3) : null,
            direccion: form.direccion.trim() || null,
          } as any,
        },
      });
      toast.success("Piscina añadida");
      setOpen(false);
      setForm({ alias: "", tipo: "", volumen_m3: "", direccion: "" });
      qc.invalidateQueries({ queryKey: ["cliente", id] });
    } catch (err: any) {
      toast.error(err?.message ?? "Error");
    }
  }

  if (isLoading) return <p className="text-sm text-muted-foreground">Cargando...</p>;
  if (!data) return null;

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <Link to="/app/clientes" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="size-4 mr-1" /> Clientes
      </Link>
      <div>
        <h1 className="text-2xl font-semibold">{data.cliente.nombre}</h1>
        <p className="text-sm text-muted-foreground">
          {[data.cliente.email, data.cliente.telefono, data.cliente.direccion].filter(Boolean).join(" · ") || "—"}
        </p>
      </div>

      <section>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold">Piscinas</h2>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button size="sm"><Plus className="size-4 mr-2" /> Añadir</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle>Nueva piscina</DialogTitle></DialogHeader>
              <form onSubmit={submit} className="space-y-3">
                <div><Label>Alias *</Label><Input required value={form.alias} onChange={(e) => setForm({ ...form, alias: e.target.value })} /></div>
                <div><Label>Tipo</Label><Input placeholder="Privada / Comunidad / Hotel" value={form.tipo} onChange={(e) => setForm({ ...form, tipo: e.target.value })} /></div>
                <div><Label>Volumen (m³)</Label><Input type="number" step="0.1" value={form.volumen_m3} onChange={(e) => setForm({ ...form, volumen_m3: e.target.value })} /></div>
                <div><Label>Dirección</Label><Input placeholder="Calle, número, ciudad" value={form.direccion} onChange={(e) => setForm({ ...form, direccion: e.target.value })} /></div>
                <DialogFooter><Button type="submit">Crear</Button></DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
        <div className="bg-card border border-border rounded-lg divide-y divide-border">
          {data.piscinas.map((p) => (
            <div key={p.id} className="p-4 flex items-center gap-3">
              <Droplets className="size-4 text-primary" />
              <div className="flex-1">
                <p className="font-medium">{p.alias}</p>
                <p className="text-xs text-muted-foreground">
                  {[p.tipo, p.volumen_m3 ? `${p.volumen_m3} m³` : null, p.sistema_desinfeccion].filter(Boolean).join(" · ") || "—"}
                </p>
              </div>
            </div>
          ))}
          {data.piscinas.length === 0 && (
            <div className="p-6 text-center text-sm text-muted-foreground">Aún no hay piscinas.</div>
          )}
        </div>
      </section>
    </div>
  );
}
