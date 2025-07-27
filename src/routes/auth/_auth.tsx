import { createFileRoute, redirect } from "@tanstack/react-router";
import { getToken } from "../../util/auth.util";

const isAuthenticated = () => {
  return getToken() !== null;
};

export const Route = createFileRoute("/auth/_auth")({
  beforeLoad: () => {
    if (isAuthenticated()) {
      throw redirect({
        to: "/prompt",
        replace: true,
      });
    }
  },
});
