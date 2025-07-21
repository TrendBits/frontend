import { createFileRoute } from "@tanstack/react-router";
import Prompt from "../../pages/protected/Prompt";

export const Route = createFileRoute("/_protected/_auth/prompt")({
  component: RouteComponent,
});

function RouteComponent() {
  return <Prompt />;
}
