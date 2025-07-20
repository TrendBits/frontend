import { createFileRoute } from "@tanstack/react-router";
import Login from "../../pages/auth/Login";
import { loginSearchSchema } from "../../schemas/auth.schema";

export const Route = createFileRoute("/auth/_auth/login")({
  validateSearch: loginSearchSchema,
  component: RouteComponent,
});

function RouteComponent() {
  return <Login />;
}
