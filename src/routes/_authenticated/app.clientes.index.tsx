import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Plus, Search } from "lucide-react";
import { listClientes, upsertCliente } from "@/lib/clientes.functions";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter,
} from "@/components/ui/dialog";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/app/clientes/")({
  component: ClientesList,
});

function ClientesList() {
  const fn = useServerFn(listClientes);
  const create = useServerFn(upsertCliente);
  const qc = useQueryClient();
  const navigate = useNavigate();
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ nombre: "", email: "", telefono: "", direccion: "" });
  const { data, isLoading } = useQuery({
    queryKey: ["clientes", q],
    queryFn: () => fn({ data: { q } }),
  });

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    try {
      const res = await create({ data: { values: form as any } });
      toast.success("Cliente creado");
      setOpen(false);
      setForm({ nombre: "", email: "", telefono: "", direccion: "" });
      qc.invalidateQueries({ queryKey: ["clientes"] });
      navigate({ to: "/app/clientes/$id", params: { id: res.id } });
    } catch (err: any) {
      toast.error(err?.message ?? "Error");
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h1 className="text-2xl font-semibold">Clientes</h1>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button><Plus className="size-4 mr-2" /> Nuevo cliente</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Nuevo cliente</DialogTitle></DialogHeader>
            <form onSubmit={submit} className="space-y-3">
              <div><Label>Nombre *</Label><Input required value={form.nombre} onChange={(e) => setForm({ ...form, nombre: e.target.value })} /></div>
              <div><Label>Email</Label><Input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></div>
              <div><Label>Teléfono</Label><Input value={form.telefono} onChange={(e) => setForm({ ...form, telefono: e.target.value })} /></div>
              <div><Label>Dirección</Label><Input value={form.direccion} onChange={(e) => setForm({ ...form, direccion: e.target.value })} /></div>
              <DialogFooter><Button type="submit">Crear</Button></DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
        <Input placeholder="Buscar por nombre..." value={q} onChange={(e) => setQ(e.target.value)} className="pl-9" />
      </div>

      <div className="bg-card border border-border rounded-lg divide-y divide-border">
        {isLoading && <div className="p-8 text-center text-sm text-muted-foreground">Cargando...</div>}
        {data?.clientes.map((c) => (
          <Link key={c.id} to="/app/clientes/$id" params={{ id: c.id }} className="flex items-center justify-between p-4 hover:bg-muted/40">
            <div>
              <p className="font-medium">{c.nombre}</p>
              <p className="text-xs text-muted-foreground">{c.email ?? c.telefono ?? c.direccion ?? "—"}</p>
            </div>
          </Link>
        ))}
        {!isLoading && (data?.clientes.length ?? 0) === 0 && (
          <div className="p-8 text-center text-sm text-muted-foreground">Aún no hay clientes.</div>
        )}
      </div>
    </div>
  );
}
