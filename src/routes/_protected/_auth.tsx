import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { clearToken, getToken } from "../../util/auth.util";
import { validateToken } from "../../api/auth.api";
import { toast } from "sonner";
import ProtectedNavbar from "@/components/ui/ProtectedNavbar";

const isAuthenticated = async () => {
  const token = getToken();
  if (!token) return false;
  try {
    const validatetionResponse = await validateToken();
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
  component: () => {
    return (
      <div className="min-w-dvw">
        <ProtectedNavbar/>
        <Outlet/>
      </div>
    );
  },
});
