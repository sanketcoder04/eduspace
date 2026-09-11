import api from "@/services/api/axios";
import { API_ENDPOINTS } from "@/services/api/endpoints";
import type { MentionCandidate } from "../types/post.types";

interface ApiEnvelope<T> {
  success: boolean;
  message: string;
  data: T;
}

export async function searchMentionCandidates(query: string): Promise<MentionCandidate[]> {
  if (!query.trim()) return [];
  const { data } = await api.get<ApiEnvelope<MentionCandidate[]>>(API_ENDPOINTS.USER.SEARCH, {
    params: { query },
  });
  return data.data;
}
