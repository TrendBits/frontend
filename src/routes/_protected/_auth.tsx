import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import ProtectedNavbar from "@/components/ui/ProtectedNavbar";
import { getAuthState, initializeGuestSession, getGuestData } from "../../util/auth.util";

export const Route = createFileRoute("/_protected/_auth")({
  beforeLoad: ({ location }) => {
    const authState = getAuthState();
    
    // Allow authenticated and guest users
    if (authState === 'authenticated' || authState === 'guest') {
      return;
    }
    
    // For unauthenticated users, only initialize guest session if no guest data exists
    if (location.pathname === '/prompt' || location.pathname === '/' || location.pathname === '/summary') {
      const existingGuestData = getGuestData();
      if (!existingGuestData) {
        initializeGuestSession();
      }
      return;
    }
    
    // Redirect to login for other protected pages
    throw redirect({
      to: "/auth/login",
      search: {
        redirect: location.href,
      },
    });
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
