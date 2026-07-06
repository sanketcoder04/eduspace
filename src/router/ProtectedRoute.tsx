import type { PropsWithChildren } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { ROUTES } from "./routes";

export default function ProtectedRoute({ children }: PropsWithChildren) {
  const { auth } = useAuth();

  if (!auth.isAuthenticated) {
    return <Navigate to={ROUTES.LOGIN} replace />;
  }
  return children;
}
