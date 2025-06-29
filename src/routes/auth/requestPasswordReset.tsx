import { createFileRoute } from "@tanstack/react-router";
import RequestResetPassword from "../../pages/auth/ResetPasswordRequest";

export const Route = createFileRoute("/auth/requestPasswordReset")({
  component: RouteComponent,
});

function RouteComponent() {
  return <RequestResetPassword />;
}
