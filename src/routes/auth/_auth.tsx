import { createFileRoute, redirect } from "@tanstack/react-router";
import { getToken } from "../../util/auth.util";

const isAuthenticated = () => {
  console.log("Checking authentication status...");
  console.log("Token:", getToken());
  return getToken() !== null;
};

export const Route = createFileRoute("/auth/_auth")({
  beforeLoad: () => {
    if (isAuthenticated()) {
      throw redirect({
        to: "/dashboard",
        replace: true,
      });
    }
  },
});
