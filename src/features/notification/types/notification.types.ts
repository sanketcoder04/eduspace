export type NotificationType =
  | "APPLICATION_RECEIVED"
  | "APPLICATION_MOVED_TO_CHAT"
  | "APPLICATION_APPROVED"
  | "APPLICATION_REJECTED"
  | "APPLICATION_WITHDRAWN"
  | "NEW_MESSAGE"
  | "CONTACT_SHARED"
  | "NEW_FOLLOWER";

export interface NotificationResponse {
  id: string;
  type: NotificationType;
  title: string;
  body: string;
  referenceType?: "OPPORTUNITY" | "APPLICATION" | "CONVERSATION" | "FOLLOW";
  referenceId?: string;
  read: boolean;
  readAt?: string;
  createdAt: string;
}
