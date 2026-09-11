import api from "@/services/api/axios";
import { API_ENDPOINTS } from "@/services/api/endpoints";
import type { Page, PageableParams } from "@/types/api.types";
import type { PostResponse, CreatePostRequest, VoteRequest } from "../types/post.types";

interface ApiEnvelope<T> {
  success: boolean;
  message: string;
  data: T;
}

function toPageParams(params?: PageableParams) {
  return { page: params?.page ?? 0, size: params?.size ?? 10 };
}

export async function createPost(payload: CreatePostRequest): Promise<PostResponse> {
  const { data } = await api.post<ApiEnvelope<PostResponse>>(API_ENDPOINTS.POST.BASE, payload);
  return data.data;
}

export async function getFeed(pageable?: PageableParams): Promise<Page<PostResponse>> {
  const { data } = await api.get<ApiEnvelope<Page<PostResponse>>>(API_ENDPOINTS.POST.FEED, {
    params: toPageParams(pageable),
  });
  return data.data;
}

export async function getPostsByUser(
  userId: string,
  pageable?: PageableParams
): Promise<Page<PostResponse>> {
  const { data } = await api.get<ApiEnvelope<Page<PostResponse>>>(
    API_ENDPOINTS.POST.BY_USER(userId),
    {
      params: toPageParams(pageable),
    }
  );
  return data.data;
}

export async function getPostById(id: string): Promise<PostResponse> {
  const { data } = await api.get<ApiEnvelope<PostResponse>>(API_ENDPOINTS.POST.BY_ID(id));
  return data.data;
}

export async function deletePost(id: string): Promise<void> {
  await api.delete(API_ENDPOINTS.POST.BY_ID(id));
}

export async function togglePostLike(id: string): Promise<boolean> {
  const { data } = await api.post<ApiEnvelope<boolean>>(API_ENDPOINTS.POST.LIKE(id));
  return data.data;
}

export async function voteOnPoll(id: string, payload: VoteRequest): Promise<PostResponse> {
  const { data } = await api.post<ApiEnvelope<PostResponse>>(API_ENDPOINTS.POST.VOTE(id), payload);
  return data.data;
}
