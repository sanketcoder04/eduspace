import api from "@/services/api/axios";
import { API_ENDPOINTS } from "@/services/api/endpoints";
import type { Page, PageableParams } from "@/types/api.types";
import type { NotificationResponse } from "../types/notification.types";

interface ApiEnvelope<T> {
  success: boolean;
  message: string;
  data: T;
}

function toPageParams(params?: PageableParams) {
  return {
    page: params?.page ?? 0,
    size: params?.size ?? 20,
  };
}

export async function getNotifications(
  pageable?: PageableParams
): Promise<Page<NotificationResponse>> {
  const { data } = await api.get<ApiEnvelope<Page<NotificationResponse>>>(
    API_ENDPOINTS.NOTIFICATION.BASE,
    { params: toPageParams(pageable) }
  );
  return data.data;
}

export async function getUnreadNotificationCount(): Promise<number> {
  const { data } = await api.get<ApiEnvelope<number>>(API_ENDPOINTS.NOTIFICATION.UNREAD_COUNT);
  return data.data;
}

export async function markNotificationRead(id: string): Promise<NotificationResponse> {
  const { data } = await api.patch<ApiEnvelope<NotificationResponse>>(
    API_ENDPOINTS.NOTIFICATION.READ(id)
  );
  return data.data;
}

export async function markAllNotificationsRead(): Promise<void> {
  await api.patch(API_ENDPOINTS.NOTIFICATION.READ_ALL);
}
