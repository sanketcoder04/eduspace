import { Routes, Route, Navigate } from "react-router-dom";
import AuthLayout from "@/layouts/AuthLayout";
import DashboardLayout from "@/layouts/DashboardLayout";
import LoginPage from "@/pages/Auth/LoginPage";
import RegisterPage from "@/pages/Auth/RegisterPage";
import DashboardPage from "@/pages/Dashboard/DashboardPage";
import NotFoundPage from "@/pages/Error/NotFoundPage";
import { ROUTES } from "./routes";
import ProtectedRoute from "./ProtectedRoute";
import PublicRoute from "./PublicRoute";
import ForgotPasswordPage from "@/pages/Auth/ForgotPasswordPage";
import VerifyOtpPage from "@/pages/Auth/VerifyOtpPage";
import VerifyEmailPage from "@/pages/Auth/VerifyEmailPage";
import ResetPasswordPage from "@/pages/Auth/ResetPasswordPage";
import GoogleSelectRolePage from "@/pages/Auth/GoogleSelectRolePage";
import ProfilePage from "@/pages/Profile/ProfilePage";
import CompleteProfilePage from "@/pages/Profile/CompleteProfilePage";
import OpportunitiesFeedPage from "@/pages/Opportunities/OpportunitiesFeedPage";
import CreateTeachingOpeningPage from "@/pages/Opportunities/CreateTeachingOpeningPage";
import CreateTuitionRequirementPage from "@/pages/Opportunities/CreateTuitionRequirementPage";
import ApplicationsPage from "@/pages/Applications/ApplicationsPage";

export default function AppRouter() {
  return (
    <Routes>
      <Route path={ROUTES.HOME} element={<Navigate to={ROUTES.LOGIN} replace />} />

      {/* ---- Public / Auth routes (unchanged) ---- */}
      <Route
        path={ROUTES.LOGIN}
        element={
          <PublicRoute>
            <AuthLayout>
              <LoginPage />
            </AuthLayout>
          </PublicRoute>
        }
      />
      <Route
        path={ROUTES.FORGOT_PASSWORD}
        element={
          <PublicRoute>
            <AuthLayout>
              <ForgotPasswordPage />
            </AuthLayout>
          </PublicRoute>
        }
      />
      <Route
        path={ROUTES.VERIFY_OTP}
        element={
          <PublicRoute>
            <AuthLayout>
              <VerifyOtpPage />
            </AuthLayout>
          </PublicRoute>
        }
      />
      <Route
        path={ROUTES.REGISTER}
        element={
          <PublicRoute>
            <AuthLayout>
              <RegisterPage />
            </AuthLayout>
          </PublicRoute>
        }
      />
      <Route
        path={ROUTES.VERIFY_EMAIL}
        element={
          <PublicRoute>
            <AuthLayout>
              <VerifyEmailPage />
            </AuthLayout>
          </PublicRoute>
        }
      />
      <Route
        path={ROUTES.RESET_PASSWORD}
        element={
          <PublicRoute>
            <AuthLayout>
              <ResetPasswordPage />
            </AuthLayout>
          </PublicRoute>
        }
      />
      <Route
        path={ROUTES.GOOGLE_SELECT_ROLE}
        element={
          <PublicRoute>
            <AuthLayout>
              <GoogleSelectRolePage />
            </AuthLayout>
          </PublicRoute>
        }
      />

      {/* ---- Protected routes — now wrapped in DashboardLayout for the navbar ---- */}
      <Route
        path={ROUTES.DASHBOARD}
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <DashboardPage />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path={ROUTES.COMPLETE_PROFILE}
        element={
          <ProtectedRoute>
            <CompleteProfilePage />
          </ProtectedRoute>
        }
      />

      <Route
        path={ROUTES.PROFILE}
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <ProfilePage />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path={ROUTES.OPPORTUNITIES}
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <OpportunitiesFeedPage />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path={ROUTES.CREATE_TEACHING_OPENING}
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <CreateTeachingOpeningPage />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path={ROUTES.CREATE_TUITION_REQUIREMENT}
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <CreateTuitionRequirementPage />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path={ROUTES.APPLICATIONS}
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <ApplicationsPage />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />

      {/* ROUTES.CONVERSATIONS / CONVERSATION_DETAIL / OPPORTUNITY_DETAIL routes
          are added in Part 6/7 once those pages exist. */}

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
