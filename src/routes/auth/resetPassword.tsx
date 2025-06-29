import { createFileRoute } from "@tanstack/react-router";
import RequestResetPassword from "../../pages/auth/ResetPasswordRequest";

export const Route = createFileRoute("/auth/resetPassword")({
  component: RouteComponent,
});

function RouteComponent() {
  return <RequestResetPassword />;
}
