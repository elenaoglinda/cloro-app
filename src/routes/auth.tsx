import { createFileRoute } from "@tanstack/react-router";
import { useEffect } from "react";

const LOGIN_URL = "https://panel.cloro.app/login";

export const Route = createFileRoute("/auth")({
  ssr: false,
  component: AuthRedirect,
});

function AuthRedirect() {
  useEffect(() => {
    window.location.replace(LOGIN_URL);
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 px-4">
      <p className="text-sm text-muted-foreground">
        Te estamos llevando a{" "}
        <a href={LOGIN_URL} className="underline hover:text-foreground">
          panel.cloro.app
        </a>
        …
      </p>
    </div>
  );
}
