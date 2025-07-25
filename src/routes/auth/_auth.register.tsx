import { createFileRoute } from "@tanstack/react-router";
import Register from "../../pages/auth/Register";

export const Route = createFileRoute("/auth/_auth/register")({
  component: RouteComponent,
});

function RouteComponent() {
  return <Register />;
}
