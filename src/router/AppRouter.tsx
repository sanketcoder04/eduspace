import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainLayout from "@/layouts/MainLayout";
import AuthLayout from "@/layouts/AuthLayout";
import DashboardLayout from "@/layouts/DashboardLayout";
import HomePage from "@/pages/Home/HomePage";
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

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path={ROUTES.HOME}
          element={
            <MainLayout>
              <HomePage />
            </MainLayout>
          }
        />

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
          path={ROUTES.DASHBOARD}
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <DashboardPage />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
}
