import type { PropsWithChildren } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { useMyProfile } from "@/features/profile/hooks/useMyProfile";
import AppLoader from "@/components/ui/AppLoader/AppLoader";
import { ROUTES } from "./routes";

export default function ProtectedRoute({ children }: PropsWithChildren) {
  const { auth, isBootstrapping } = useAuth();
  const location = useLocation();

  const { profile, isLoading: isProfileLoading, isFetched: isProfileFetched } = useMyProfile();

  if (isBootstrapping) {
    return <AppLoader fullscreen text="Checking session..." />;
  }
  if (!auth.isAuthenticated) {
    return <Navigate to={ROUTES.LOGIN} replace />;
  }

  // Wait for the profile-completion check before deciding where to send the user —
  // avoids a flash of the dashboard for someone who hasn't finished onboarding.
  if (isProfileLoading && !isProfileFetched) {
    return <AppLoader fullscreen text="Loading your profile..." />;
  }

  const onCompleteProfileRoute = location.pathname.startsWith(ROUTES.COMPLETE_PROFILE);

  if (profile && !profile.profileCompleted && !onCompleteProfileRoute) {
    return <Navigate to={ROUTES.COMPLETE_PROFILE} replace />;
  }

  return children;
}
