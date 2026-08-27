import api from "@/services/api/axios";
import { API_ENDPOINTS } from "@/services/api/endpoints";
import type { Page, PageableParams } from "@/types/api.types";
import type {
  OpportunityResponse,
  CreateTeachingOpeningRequest,
  CreateTuitionRequirementRequest,
  OpportunityFilterRequest,
} from "../types/opportunity.types";

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

export async function createTeachingOpening(
  payload: CreateTeachingOpeningRequest
): Promise<OpportunityResponse> {
  const { data } = await api.post<ApiEnvelope<OpportunityResponse>>(
    API_ENDPOINTS.OPPORTUNITY.TEACHING_OPENINGS,
    payload
  );
  return data.data;
}

export async function createTuitionRequirement(
  payload: CreateTuitionRequirementRequest
): Promise<OpportunityResponse> {
  const { data } = await api.post<ApiEnvelope<OpportunityResponse>>(
    API_ENDPOINTS.OPPORTUNITY.TUITION_REQUIREMENTS,
    payload
  );
  return data.data;
}

export async function searchOpportunities(
  filter: OpportunityFilterRequest,
  pageable?: PageableParams
): Promise<Page<OpportunityResponse>> {
  const { data } = await api.post<ApiEnvelope<Page<OpportunityResponse>>>(
    API_ENDPOINTS.OPPORTUNITY.SEARCH,
    filter,
    { params: toPageParams(pageable) }
  );
  return data.data;
}

export async function getOpportunityById(id: string): Promise<OpportunityResponse> {
  const { data } = await api.get<ApiEnvelope<OpportunityResponse>>(
    API_ENDPOINTS.OPPORTUNITY.BY_ID(id)
  );
  return data.data;
}

export async function closeOpportunity(id: string): Promise<OpportunityResponse> {
  const { data } = await api.patch<ApiEnvelope<OpportunityResponse>>(
    API_ENDPOINTS.OPPORTUNITY.CLOSE(id)
  );
  return data.data;
}

export async function reopenOpportunity(id: string): Promise<OpportunityResponse> {
  const { data } = await api.patch<ApiEnvelope<OpportunityResponse>>(
    API_ENDPOINTS.OPPORTUNITY.REOPEN(id)
  );
  return data.data;
}
