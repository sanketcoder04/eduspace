import type { PropsWithChildren } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/features/auth/hooks/useAuth";
import AppLoader from "@/components/ui/AppLoader/AppLoader";
import { ROUTES } from "./routes";

export default function PublicRoute({ children }: PropsWithChildren) {
  const { auth, isBootstrapping } = useAuth();

  if (isBootstrapping) {
    return <AppLoader fullscreen text="Checking session..." />;
  }
  if (auth.isAuthenticated) {
    return <Navigate to={ROUTES.DASHBOARD} replace />;
  }

  return children;
}
