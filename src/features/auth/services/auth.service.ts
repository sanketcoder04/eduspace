import api from "@/services/api/axios";
import { API_ENDPOINTS } from "@/services/api/endpoints";
import type {
  RegisterRequest,
  RegisterResponse,
  VerifyEmailRequest,
  VerifyEmailResponse,
  ResendOtpRequest,
  ResendOtpResponse,
  LoginRequest,
  LoginResponse,
  ForgotPasswordResponse,
  ForgotPasswordRequest,
  VerifyPasswordResetOtpRequest,
  VerifyPasswordResetOtpResponse,
  ResetPasswordRequest,
  ResetPasswordResponse,
} from "../types/auth.types";

export async function register(payload: RegisterRequest): Promise<RegisterResponse> {
  const { data } = await api.post<RegisterResponse>(API_ENDPOINTS.AUTH.REGISTER, payload);
  return data;
}

export async function verifyEmail(payload: VerifyEmailRequest): Promise<VerifyEmailResponse> {
  const { data } = await api.post<VerifyEmailResponse>(API_ENDPOINTS.AUTH.VERIFY_EMAIL, payload);
  return data;
}

export async function resendOtp(payload: ResendOtpRequest): Promise<ResendOtpResponse> {
  const { data } = await api.post<ResendOtpResponse>(API_ENDPOINTS.AUTH.RESEND_OTP, payload);
  return data;
}

export async function login(payload: LoginRequest): Promise<LoginResponse> {
  const { data } = await api.post<LoginResponse>(API_ENDPOINTS.AUTH.LOGIN, payload);
  return data;
}

export async function forgotPassword(
  payload: ForgotPasswordRequest
): Promise<ForgotPasswordResponse> {
  const { data } = await api.post<ForgotPasswordResponse>(
    API_ENDPOINTS.AUTH.FORGOT_PASSWORD,
    payload
  );
  return data;
}

export async function verifyPasswordResetOtp(
  payload: VerifyPasswordResetOtpRequest
): Promise<VerifyPasswordResetOtpResponse> {
  const { data } = await api.post<VerifyPasswordResetOtpResponse>(
    API_ENDPOINTS.AUTH.VERIFY_PASSWORD_RESET_OTP,
    payload
  );
  return data;
}

export async function resetPassword(payload: ResetPasswordRequest): Promise<ResetPasswordResponse> {
  const { data } = await api.post<ResetPasswordResponse>(
    API_ENDPOINTS.AUTH.RESET_PASSWORD,
    payload
  );
  return data;
}
