export type NotificationType =
  | "APPLICATION_RECEIVED"
  | "APPLICATION_APPROVED"
  | "APPLICATION_REJECTED"
  | "APPLICATION_WITHDRAWN"
  | "NEW_MESSAGE"
  | "CONTACT_SHARED";

export interface NotificationResponse {
  id: string;
  type: NotificationType;
  title: string;
  body: string;
  referenceType?: "OPPORTUNITY" | "APPLICATION" | "CONVERSATION";
  referenceId?: string;
  read: boolean;
  readAt?: string;
  createdAt: string;
}
