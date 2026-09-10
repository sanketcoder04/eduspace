import api from "@/services/api/axios";
import type { Page, PageableParams } from "@/types/api.types";
import type { FollowedUser } from "../types/follow.types";

interface ApiEnvelope<T> {
  success: boolean;
  message: string;
  data: T;
}

function toPageParams(params?: PageableParams) {
  return { page: params?.page ?? 0, size: params?.size ?? 20 };
}

export async function followUser(userId: string): Promise<void> {
  await api.post<ApiEnvelope<void>>(`/follows/${userId}`);
}

export async function unfollowUser(userId: string): Promise<void> {
  await api.delete<ApiEnvelope<void>>(`/follows/${userId}`);
}

export async function getFollowStatus(userId: string): Promise<boolean> {
  const { data } = await api.get<ApiEnvelope<boolean>>(`/follows/${userId}/status`);
  return data.data;
}

export async function getFollowStats(
  userId: string
): Promise<{ followersCount: number; followingCount: number }> {
  const { data } = await api.get<ApiEnvelope<{ followersCount: number; followingCount: number }>>(
    `/follows/${userId}/stats`
  );
  return data.data;
}

export async function getFollowers(
  userId: string,
  pageable?: PageableParams
): Promise<Page<FollowedUser>> {
  const { data } = await api.get<ApiEnvelope<Page<FollowedUser>>>(`/follows/${userId}/followers`, {
    params: toPageParams(pageable),
  });
  return data.data;
}

export async function getFollowing(
  userId: string,
  pageable?: PageableParams
): Promise<Page<FollowedUser>> {
  const { data } = await api.get<ApiEnvelope<Page<FollowedUser>>>(`/follows/${userId}/following`, {
    params: toPageParams(pageable),
  });
  return data.data;
}
