import api from "@/services/api/axios";
import { API_ENDPOINTS } from "@/services/api/endpoints";
import type { SearchPage } from "../types/search.types";

interface ApiEnvelope<T> {
  success: boolean;
  message: string;
  data: T;
}

export async function discoverUsers(
  query: string,
  page: number,
  signal?: AbortSignal
): Promise<SearchPage> {
  const { data } = await api.get<ApiEnvelope<SearchPage>>(API_ENDPOINTS.FOLLOW.DISCOVER, {
    params: { query, page },
    signal,
  });
  return data.data;
}
