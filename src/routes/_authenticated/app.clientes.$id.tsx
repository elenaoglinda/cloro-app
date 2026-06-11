import { createFileRoute, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Plus, ArrowLeft, Droplets, Pencil } from "lucide-react";
import { getCliente, upsertCliente } from "@/lib/clientes.functions";
import { upsertPiscina } from "@/lib/piscinas.functions";
import { AddressAutocomplete } from "@/components/app/AddressAutocomplete";
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

type PiscinaForm = { id?: string; alias: string; tipo: string; volumen_m3: string; direccion: string };
const emptyPiscina: PiscinaForm = { alias: "", tipo: "", volumen_m3: "", direccion: "" };

function ClienteDetail() {
  const { id } = Route.useParams();
  const fn = useServerFn(getCliente);
  const savePiscina = useServerFn(upsertPiscina);
  const saveCliente = useServerFn(upsertCliente);
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [form, setForm] = useState<PiscinaForm>(emptyPiscina);
  const { data, isLoading } = useQuery({ queryKey: ["cliente", id], queryFn: () => fn({ data: { id } }) });
  const [cForm, setCForm] = useState({ nombre: "", email: "", telefono: "", direccion: "" });

  async function submitPiscina(e: React.FormEvent) {
    e.preventDefault();
    if (!form.direccion.trim()) { toast.error("La dirección es obligatoria"); return; }
    try {
      await savePiscina({
        data: {
          id: form.id,
          values: {
            cliente_id: id,
            alias: form.alias,
            tipo: form.tipo || null,
            volumen_m3: form.volumen_m3 ? Number(form.volumen_m3) : null,
            direccion: form.direccion.trim(),
          } as any,
        },
      });
      toast.success(form.id ? "Piscina actualizada" : "Piscina añadida");
      setOpen(false);
      setForm(emptyPiscina);
      qc.invalidateQueries({ queryKey: ["cliente", id] });
    } catch (err: any) {
      toast.error(err?.message ?? "Error");
    }
  }

  async function submitCliente(e: React.FormEvent) {
    e.preventDefault();
    try {
      await saveCliente({ data: { id, values: cForm as any } });
      toast.success("Cliente actualizado");
      setEditOpen(false);
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
      <div className="flex items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold">{data.cliente.nombre}</h1>
          <p className="text-sm text-muted-foreground">
            {[data.cliente.email, data.cliente.telefono, data.cliente.direccion].filter(Boolean).join(" · ") || "—"}
          </p>
        </div>
        <Dialog open={editOpen} onOpenChange={(o) => {
          setEditOpen(o);
          if (o) setCForm({
            nombre: data.cliente.nombre ?? "",
            email: data.cliente.email ?? "",
            telefono: data.cliente.telefono ?? "",
            direccion: data.cliente.direccion ?? "",
          });
        }}>
          <DialogTrigger asChild>
            <Button size="sm" variant="outline"><Pencil className="size-4 mr-1" /> Editar</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Editar cliente</DialogTitle></DialogHeader>
            <form onSubmit={submitCliente} className="space-y-3">
              <div><Label>Nombre *</Label><Input required value={cForm.nombre} onChange={(e) => setCForm({ ...cForm, nombre: e.target.value })} /></div>
              <div><Label>Email</Label><Input type="email" value={cForm.email} onChange={(e) => setCForm({ ...cForm, email: e.target.value })} /></div>
              <div><Label>Teléfono</Label><Input value={cForm.telefono} onChange={(e) => setCForm({ ...cForm, telefono: e.target.value })} /></div>
              <div><Label>Dirección</Label><Input value={cForm.direccion} onChange={(e) => setCForm({ ...cForm, direccion: e.target.value })} /></div>
              <DialogFooter><Button type="submit">Guardar</Button></DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <section>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold">Piscinas</h2>
          <Dialog open={open} onOpenChange={(o) => { setOpen(o); if (!o) setForm(emptyPiscina); }}>
            <DialogTrigger asChild>
              <Button size="sm" onClick={() => setForm(emptyPiscina)}><Plus className="size-4 mr-2" /> Añadir</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle>{form.id ? "Editar piscina" : "Nueva piscina"}</DialogTitle></DialogHeader>
              <form onSubmit={submitPiscina} className="space-y-3">
                <div><Label>Alias *</Label><Input required value={form.alias} onChange={(e) => setForm({ ...form, alias: e.target.value })} /></div>
                <div><Label>Tipo</Label><Input placeholder="Privada / Comunidad / Hotel" value={form.tipo} onChange={(e) => setForm({ ...form, tipo: e.target.value })} /></div>
                <div><Label>Volumen (m³)</Label><Input type="number" step="0.1" value={form.volumen_m3} onChange={(e) => setForm({ ...form, volumen_m3: e.target.value })} /></div>
                <div>
                  <Label>Dirección *</Label>
                  <Input required placeholder="Calle, número, ciudad" value={form.direccion} onChange={(e) => setForm({ ...form, direccion: e.target.value })} />
                  <p className="text-[11px] text-muted-foreground mt-1">Necesaria para planificar rutas en mapa.</p>
                </div>
                <DialogFooter><Button type="submit">{form.id ? "Guardar" : "Crear"}</Button></DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
        <div className="bg-card border border-border rounded-lg divide-y divide-border">
          {data.piscinas.map((p: any) => (
            <div key={p.id} className="p-4 flex items-center gap-3">
              <Droplets className="size-4 text-primary" />
              <div className="flex-1">
                <p className="font-medium">{p.alias}</p>
                <p className="text-xs text-muted-foreground">
                  {[p.tipo, p.volumen_m3 ? `${p.volumen_m3} m³` : null, p.sistema_desinfeccion, p.direccion].filter(Boolean).join(" · ") || "—"}
                </p>
              </div>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => {
                  setForm({
                    id: p.id,
                    alias: p.alias ?? "",
                    tipo: p.tipo ?? "",
                    volumen_m3: p.volumen_m3 != null ? String(p.volumen_m3) : "",
                    direccion: p.direccion ?? "",
                  });
                  setOpen(true);
                }}
              >
                <Pencil className="size-4" />
              </Button>
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
