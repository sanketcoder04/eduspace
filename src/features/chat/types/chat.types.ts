export type ConversationStatus = "ACTIVE" | "CLOSED";
export type MessageType = "TEXT" | "SYSTEM" | "CONTACT_SHARE_UPDATE";

export interface ConversationResponse {
  id: string;
  applicationId: string;

  opportunityId: string;
  opportunityTitle: string;

  authorId: string;
  authorName: string;
  authorAvatarUrl?: string;

  applicantId: string;
  applicantName: string;
  applicantAvatarUrl?: string;

  status: ConversationStatus;

  lastMessagePreview?: string;
  lastMessageAt?: string;

  createdAt: string;
}

export interface MessageResponse {
  id: string;
  conversationId: string;

  senderId?: string; // undefined for SYSTEM / CONTACT_SHARE_UPDATE messages
  senderName?: string;

  type: MessageType;
  content: string;
  read: boolean;
  readAt?: string;

  createdAt: string;
}

export interface SendMessageRequest {
  content: string;
}

// ---- WebSocket-only event payloads (never hit REST) ----

export interface TypingEvent {
  conversationId: string;
  userId: string;
  typing: boolean;
}

export interface ReadReceiptEvent {
  conversationId: string;
  readerId: string;
  readAt: string;
}

export interface PresenceEvent {
  userId: string;
  online: boolean;
  at: string;
}

export interface WsErrorEvent {
  error: string;
}
