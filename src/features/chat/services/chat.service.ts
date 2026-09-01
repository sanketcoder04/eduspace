import api from "@/services/api/axios";
import { API_ENDPOINTS } from "@/services/api/endpoints";
import type { Page, PageableParams } from "@/types/api.types";
import type {
  ConversationResponse,
  MessageResponse,
  SendMessageRequest,
} from "../types/chat.types";

interface ApiEnvelope<T> {
  success: boolean;
  message: string;
  data: T;
}

function toPageParams(params?: PageableParams) {
  return {
    page: params?.page ?? 0,
    size: params?.size ?? 30,
  };
}

export async function getMyConversations(
  pageable?: PageableParams
): Promise<Page<ConversationResponse>> {
  const { data } = await api.get<ApiEnvelope<Page<ConversationResponse>>>(
    API_ENDPOINTS.CONVERSATION.BASE,
    { params: toPageParams(pageable) }
  );
  return data.data;
}

export async function getMessages(
  conversationId: string,
  pageable?: PageableParams
): Promise<Page<MessageResponse>> {
  const { data } = await api.get<ApiEnvelope<Page<MessageResponse>>>(
    API_ENDPOINTS.CONVERSATION.MESSAGES(conversationId),
    { params: toPageParams(pageable) }
  );
  return data.data;
}

/**
 * REST fallback for sending — used only if the WS connection is briefly
 * down. Hits the exact same ChatService#sendMessage on the backend as the
 * `/app/conversations/{id}/send` STOMP frame, so there's no behavioral
 * divergence between the two paths; the live broadcast still happens either way.
 */
export async function sendMessageViaRest(
  conversationId: string,
  payload: SendMessageRequest
): Promise<MessageResponse> {
  const { data } = await api.post<ApiEnvelope<MessageResponse>>(
    API_ENDPOINTS.CONVERSATION.MESSAGES(conversationId),
    payload
  );
  return data.data;
}
