import { createFileRoute } from "@tanstack/react-router";
import Prompt from "../../pages/protected/Prompt";

type PromptSearch = {
  prompt?: string;
};

export const Route = createFileRoute("/_protected/_auth/prompt")({
  validateSearch: (search: Record<string, unknown>): PromptSearch => {
    return {
      prompt: search.prompt as string,
    };
  },
  component: RouteComponent,
});

function RouteComponent() {
  return <Prompt />;
}
