export type NotificationType =
  | "APPLICATION_RECEIVED"
  | "APPLICATION_MOVED_TO_CHAT"
  | "APPLICATION_APPROVED"
  | "APPLICATION_REJECTED"
  | "APPLICATION_WITHDRAWN"
  | "NEW_MESSAGE"
  | "CONTACT_SHARED"
  | "NEW_FOLLOWER"
  | "POST_LIKED"
  | "POST_COMMENTED"
  | "POST_MENTION"
  | "COMMENT_MENTION";

export interface NotificationResponse {
  id: string;
  type: NotificationType;
  title: string;
  body: string;
  referenceType?:
    "OPPORTUNITY" | "APPLICATION" | "CONVERSATION" | "FOLLOW" | "PROFILE" | "POST" | "COMMENT";
  referenceId?: string;
  read: boolean;
  readAt?: string;
  createdAt: string;
}
