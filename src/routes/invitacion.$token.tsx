import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { acceptInvite } from "@/lib/invites.functions";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/invitacion/$token")({
  component: AcceptInvite,
});

function AcceptInvite() {
  const { token } = Route.useParams();
  const navigate = useNavigate();
  const acceptFn = useServerFn(acceptInvite);
  const [status, setStatus] = useState<"checking" | "needs-auth" | "ready" | "accepting" | "done" | "error">("checking");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (!data.user) {
        sessionStorage.setItem("pending_invite", token);
        setStatus("needs-auth");
      } else {
        setStatus("ready");
      }
    });
  }, [token]);

  async function accept() {
    setStatus("accepting");
    try {
      await acceptFn({ data: { token } });
      setStatus("done");
      setTimeout(() => navigate({ to: "/app" }), 800);
    } catch (err: any) {
      setError(err.message || "Error");
      setStatus("error");
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/20 px-4">
      <div className="max-w-md w-full bg-card border border-border rounded-lg p-6 space-y-4 text-center">
        <h1 className="text-xl font-semibold">Invitación a un equipo Cloro</h1>
        {status === "checking" && <p className="text-sm text-muted-foreground">Comprobando...</p>}
        {status === "needs-auth" && (
          <>
            <p className="text-sm text-muted-foreground">Inicia sesión con la cuenta invitada para aceptar.</p>
            <Button onClick={() => navigate({ to: "/auth" })} className="w-full">Iniciar sesión</Button>
          </>
        )}
        {status === "ready" && (
          <>
            <p className="text-sm text-muted-foreground">Pulsa para unirte al equipo.</p>
            <Button onClick={accept} className="w-full">Aceptar invitación</Button>
          </>
        )}
        {status === "accepting" && <p className="text-sm text-muted-foreground">Aceptando...</p>}
        {status === "done" && <p className="text-sm text-primary">Listo, redirigiendo...</p>}
        {status === "error" && <p className="text-sm text-destructive">{error}</p>}
      </div>
    </div>
  );
}
