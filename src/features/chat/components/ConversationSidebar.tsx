import { Empty, Skeleton } from "antd";
import ConversationListItem from "./ConversationListItem";
import type { ConversationResponse } from "../types/chat.types";

interface ConversationSidebarProps {
  conversations: ConversationResponse[] | undefined;
  isLoading: boolean;
  activeConversationId: string | undefined;
  onlineUserIds: Set<string>;
  onSelect: (conversationId: string) => void;
  currentUserId: string | undefined;
}

export default function ConversationSidebar({
  conversations,
  isLoading,
  activeConversationId,
  onlineUserIds,
  onSelect,
}: ConversationSidebarProps) {
  if (isLoading && !conversations) {
    return (
      <div className="h-full space-y-2 overflow-y-auto p-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} active avatar paragraph={{ rows: 1 }} />
        ))}
      </div>
    );
  }

  if (!conversations || conversations.length === 0) {
    return (
      <div className="flex h-full items-center justify-center p-6">
        <Empty description="No conversations yet — approved applications start a chat here." />
      </div>
    );
  }

  return (
    // h-full so this fills exactly the space its already-constrained parent
    // (ConversationsLayout's sidebar wrapper) gives it, and overflow-y-auto
    // is what scrolls the list internally as it grows past that space —
    // instead of this div growing taller than its parent and dragging the
    // whole page down with it.
    <div className="h-full space-y-1 overflow-y-auto p-2">
      {conversations.map((conversation) => {
        const isOnline =
          onlineUserIds.has(conversation.authorId) || onlineUserIds.has(conversation.applicantId);

        return (
          <ConversationListItem
            key={conversation.id}
            conversation={conversation}
            isActive={conversation.id === activeConversationId}
            isOnline={isOnline}
            onSelect={() => onSelect(conversation.id)}
          />
        );
      })}
    </div>
  );
}
