import api from "@/services/api/axios";
import { API_ENDPOINTS } from "@/services/api/endpoints";
import type { Page, PageableParams } from "@/types/api.types";
import type {
  ApplicationResponse,
  CreateApplicationRequest,
  RejectApplicationRequest,
  ContactShareConsentRequest,
} from "../types/application.types";

interface ApiEnvelope<T> {
  success: boolean;
  message: string;
  data: T;
}

function toPageParams(params?: PageableParams) {
  return {
    page: params?.page ?? 0,
    size: params?.size ?? 20,
    ...(params?.sort ? { sort: params.sort } : {}),
  };
}

export async function applyToOpportunity(
  payload: CreateApplicationRequest
): Promise<ApplicationResponse> {
  const { data } = await api.post<ApiEnvelope<ApplicationResponse>>(
    API_ENDPOINTS.APPLICATION.BASE,
    payload
  );
  return data.data;
}

export async function getSentApplications(
  pageable?: PageableParams
): Promise<Page<ApplicationResponse>> {
  const { data } = await api.get<ApiEnvelope<Page<ApplicationResponse>>>(
    API_ENDPOINTS.APPLICATION.SENT,
    { params: toPageParams(pageable) }
  );
  return data.data;
}

export async function getReceivedApplications(
  pageable?: PageableParams
): Promise<Page<ApplicationResponse>> {
  const { data } = await api.get<ApiEnvelope<Page<ApplicationResponse>>>(
    API_ENDPOINTS.APPLICATION.RECEIVED,
    { params: toPageParams(pageable) }
  );
  return data.data;
}

export async function approveApplication(id: string): Promise<ApplicationResponse> {
  const { data } = await api.patch<ApiEnvelope<ApplicationResponse>>(
    API_ENDPOINTS.APPLICATION.APPROVE(id)
  );
  return data.data;
}

export async function rejectApplication(
  id: string,
  payload?: RejectApplicationRequest
): Promise<ApplicationResponse> {
  const { data } = await api.patch<ApiEnvelope<ApplicationResponse>>(
    API_ENDPOINTS.APPLICATION.REJECT(id),
    payload
  );
  return data.data;
}

export async function withdrawApplication(id: string): Promise<ApplicationResponse> {
  const { data } = await api.patch<ApiEnvelope<ApplicationResponse>>(
    API_ENDPOINTS.APPLICATION.WITHDRAW(id)
  );
  return data.data;
}

export async function updateContactConsent(
  id: string,
  payload: ContactShareConsentRequest
): Promise<ApplicationResponse> {
  const { data } = await api.patch<ApiEnvelope<ApplicationResponse>>(
    API_ENDPOINTS.APPLICATION.CONTACT_CONSENT(id),
    payload
  );
  return data.data;
}
