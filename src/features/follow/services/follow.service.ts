import api from "@/services/api/axios";

interface ApiEnvelope<T> {
  success: boolean;
  message: string;
  data: T;
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
