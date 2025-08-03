import { createFileRoute, redirect } from "@tanstack/react-router";
import { verifyTokenSchema } from "../../../schemas/auth.schema";
import { verifyResetPassToken } from "../../../api/auth.api";
import { toast } from "sonner";
import ResetPassword from "../../../pages/auth/ResetPassword";

export const Route = createFileRoute("/auth/request-password/verify")({
  component: RouteComponent,
  validateSearch: verifyTokenSchema,
  loaderDeps: ({ search: { token } }) => ({ token }),
  loader: async ({ deps: { token } }) => {
    if (!token) {
      toast.error('Invalid token');
      throw redirect({ to: '/auth/request-password/reset' });
    }
    
    try {
      const response = await verifyResetPassToken(token);
      return { success: true, data: response, token };
    } catch (error: any) {
      toast.error(error?.message || 'Verification failed');
      throw redirect({ to: '/auth/request-password/reset' });
    }
  },
});

function RouteComponent() {
  const loaderData = Route.useLoaderData();

  return (
    <ResetPassword loaderResult={loaderData} />
  );
}
