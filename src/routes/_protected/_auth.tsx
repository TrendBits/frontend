import { createFileRoute, redirect } from "@tanstack/react-router";
import { clearToken, getToken } from "../../util/auth.util";
import { validateToken } from "../../api/auth.api";

const isAuthenticated = async () => {
  const token = getToken();
  if (!token) return false;
  try {
    return await validateToken();
  } catch (_error) {
    return false;
  }
};

export const Route = createFileRoute("/_protected/_auth")({
  beforeLoad: async ({ location }) => {
    const authenticated = await isAuthenticated();
    if (!authenticated) {
      clearToken();
      throw redirect({
        to: "/auth/login",
        search: {
          redirect: location.href,
        },
      });
    }
  },
});
