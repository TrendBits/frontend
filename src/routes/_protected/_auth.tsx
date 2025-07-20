import { createFileRoute, redirect } from "@tanstack/react-router";
import { clearToken, getToken } from "../../util/auth.util";
import { validateToken } from "../../api/auth.api";
import { toast } from "sonner";

const isAuthenticated = async () => {
  const token = getToken();
  if (!token) return false;
  try {
    const validatetionResponse = await validateToken();
    console.log("Validation Response:", validatetionResponse);
    return validatetionResponse;
  } catch (_error) {
    return false;
  }
};

export const Route = createFileRoute("/_protected/_auth")({
  beforeLoad: async ({ location }) => {
    const authenticated = await isAuthenticated();
    if (!authenticated) {
      clearToken();
      toast.error("Oops! You're not authenticated. Please log in.");
      throw redirect({
        to: "/auth/login",
        search: {
          redirect: location.href,
        },
      });
    }
  },
});
