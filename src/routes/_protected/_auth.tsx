import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import ProtectedNavbar from "@/components/ui/ProtectedNavbar";
import { getToken } from "../../util/auth.util";

const isAuthenticated = () => {
  return getToken() !== null;
};

export const Route = createFileRoute("/_protected/_auth")({
  beforeLoad: ({ location }) => {
    if (!isAuthenticated()) {
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
