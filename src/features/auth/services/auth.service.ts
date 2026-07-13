import api from "@/services/api/axios";
import { API_ENDPOINTS } from "@/services/api/endpoints";
import type {
  RegisterRequest,
  RegisterResponse,
  VerifyEmailRequest,
  VerifyEmailResponse,
  ResendOtpRequest,
  ResendOtpResponse,
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
