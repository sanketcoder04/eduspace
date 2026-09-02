import { useConversations } from "./useConversations";

/** Powers the Chat nav icon's badge — counts conversations with unread messages, using the same list ConversationsLayout fetches. */
export function useTotalUnreadMessages(): number {
  const { data } = useConversations({ page: 0, size: 50 });
  return data?.content.filter((conversation) => conversation.unreadCount > 0).length ?? 0;
}
