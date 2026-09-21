
const STATUSES = [
  { value: "active", label: "Activa" },
  { value: "trialing", label: "En prueba" },
  { value: "past_due", label: "Pago pendiente" },
  { value: "cancelled", label: "Cancelada" },
] as const;

function toDateInput(v: string | null | undefined) {
  if (!v) return "";
  const d = new Date(v);
  return Number.isNaN(d.getTime()) ? "" : d.toISOString().slice(0, 10);
}

function SubscriptionCard({
  orgId,
  subscription,
  orgPlan,
}: {
  orgId: string;
  subscription: {
    plan: string;
    status: string;
    trial_ends_at: string | null;
    current_period_end: string | null;
    notes: string | null;
  } | null;
  orgPlan: string | null;
}) {
  const qc = useQueryClient();
  const save = useServerFn(upsertSubscription);
  const [plan, setPlan] = useState(subscription?.plan ?? orgPlan ?? "free");
  const [status, setStatus] = useState(subscription?.status ?? "trialing");
  const [trial, setTrial] = useState(toDateInput(subscription?.trial_ends_at));
  const [periodEnd, setPeriodEnd] = useState(toDateInput(subscription?.current_period_end));
  const [notes, setNotes] = useState(subscription?.notes ?? "");
  const [saving, setSaving] = useState(false);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      await save({
        data: {
          orgId,
          plan: plan as any,
          status: status as any,
          trial_ends_at: trial || null,
          current_period_end: periodEnd || null,
          notes: notes || null,
        },
      });
      toast.success("Suscripción actualizada");
      qc.invalidateQueries({ queryKey: ["admin-org", orgId] });
      qc.invalidateQueries({ queryKey: ["admin-orgs"] });
    } catch (err: any) {
      toast.error(err?.message ?? "Error");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form
      onSubmit={handleSave}
      className="bg-card border border-border rounded-lg p-4 space-y-4"
    >
      {!subscription && (
        <p className="text-xs text-muted-foreground">
          Esta organización todavía no tiene una suscripción registrada. Al guardar se creará.
        </p>
      )}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
        <div className="space-y-1.5">
          <Label>Plan</Label>
          <Select value={plan} onValueChange={setPlan}>
            <SelectTrigger className="h-9">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {PLANS.map((p) => (
                <SelectItem key={p} value={p} className="capitalize">
                  {p}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1.5">
          <Label>Estado</Label>
          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger className="h-9">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {STATUSES.map((s) => (
                <SelectItem key={s.value} value={s.value}>
                  {s.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1.5">
          <Label>Fin de prueba</Label>
          <Input type="date" value={trial} onChange={(e) => setTrial(e.target.value)} />
        </div>
        <div className="space-y-1.5">
          <Label>Fin del periodo</Label>
          <Input
            type="date"
            value={periodEnd}
            onChange={(e) => setPeriodEnd(e.target.value)}
          />
        </div>
      </div>
      <div className="space-y-1.5">
        <Label>Notas internas</Label>
        <Textarea
          rows={3}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Condiciones acordadas, descuentos, avisos…"
        />
      </div>
      <div className="flex justify-end">
        <Button type="submit" size="sm" disabled={saving}>
          {saving ? "Guardando…" : "Guardar suscripción"}
        </Button>
      </div>
    </form>
  );
}
