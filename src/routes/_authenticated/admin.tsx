import { createFileRoute, redirect, isRedirect } from "@tanstack/react-router";
import { checkSuperAdmin } from "@/lib/superadmin.functions";

export const Route = createFileRoute("/_authenticated/admin")({
  beforeLoad: async () => {
    try {
      const { isSuperAdmin } = await checkSuperAdmin();
      if (!isSuperAdmin) throw redirect({ to: "/app" });
      throw redirect({ to: "/superadmin" });
    } catch (e) {
      if (isRedirect(e)) throw e;
      throw redirect({ to: "/app" });
    }
  },
  component: () => null,
});
