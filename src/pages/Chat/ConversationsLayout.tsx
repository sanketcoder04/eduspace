import { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { MessageCircle } from "lucide-react";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { useConversations } from "@/features/chat/hooks/useConversations";
import { useConversationSubscription } from "@/features/chat/hooks/useConversationSubscription";
import ConversationSidebar from "@/features/chat/components/ConversationSidebar";
import ConversationThread from "@/features/chat/components/ConversationThread";
import type { MessageResponse, ReadReceiptEvent } from "@/features/chat/types/chat.types";
import { ROUTES } from "@/router/routes";
import { Spin } from "antd";

export default function ConversationsLayout() {
  const { id: activeConversationId } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { auth, isBootstrapping } = useAuth();

  const { data: conversationsPage, isLoading } = useConversations({ page: 0, size: 50 });

  const [onlineUserIds, setOnlineUserIds] = useState<Set<string>>(new Set());
  const [typingByConversation, setTypingByConversation] = useState<Record<string, boolean>>({});
  const [liveMessage, setLiveMessage] = useState<MessageResponse | null>(null);

  const [readReceiptEvent, setReadReceiptEvent] = useState<ReadReceiptEvent | null>(null);

  const { sendMessage, sendTyping, markRead, isConnected } = useConversationSubscription({
    onMessage: (message) => {
      setLiveMessage(message);
    },
    onTyping: (event) => {
      setTypingByConversation((prev) => ({ ...prev, [event.conversationId]: event.typing }));
    },
    onReadReceipt: (event) => {
      setReadReceiptEvent(event);
    },
    onPresence: (event) => {
      setOnlineUserIds((prev) => {
        const next = new Set(prev);
        if (event.online) next.add(event.userId);
        else next.delete(event.userId);
        return next;
      });
    },
  });

  const activeConversation = useMemo(
    () => conversationsPage?.content.find((c) => c.id === activeConversationId),
    [conversationsPage, activeConversationId]
  );

  const handleSelect = (conversationId: string) => {
    navigate(ROUTES.CONVERSATION_DETAIL(conversationId));
  };

  if (isBootstrapping || !auth.user?.id) {
    return (
      <div className="flex h-[calc(100vh-64px-56px)] items-center justify-center sm:h-[calc(100vh-88px)]">
        <Spin />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-0 py-0 sm:px-6 sm:py-6">
      <div className="grid h-[calc(100vh-64px-56px)] min-h-0 grid-cols-1 overflow-hidden rounded-none border-0 bg-white dark:bg-neutral-900 sm:h-[calc(100vh-88px)] sm:rounded-2xl sm:border sm:border-gray-200 lg:grid-cols-[320px_1fr] dark:sm:border-neutral-800">
        <div
          className={`
            h-full min-h-0 overflow-hidden border-gray-100 dark:border-neutral-800
            lg:block lg:border-r
            ${activeConversationId ? "hidden lg:block" : "block"}
          `}
        >
          <ConversationSidebar
            conversations={conversationsPage?.content}
            isLoading={isLoading}
            activeConversationId={activeConversationId}
            onlineUserIds={onlineUserIds}
            onSelect={handleSelect}
            currentUserId={auth.user?.id}
          />
        </div>

        {/* Thread column — same fix: constrain this box, let ConversationThread's
            own internal scroll container do the actual scrolling. */}
        <div
          className={`h-full min-h-0 overflow-hidden ${activeConversationId ? "block" : "hidden lg:block"}`}
        >
          {activeConversation ? (
            <ConversationThread
              conversation={activeConversation}
              isOtherPartyOnline={
                onlineUserIds.has(activeConversation.authorId) ||
                onlineUserIds.has(activeConversation.applicantId)
              }
              isOtherPartyTyping={!!typingByConversation[activeConversation.id]}
              isSocketConnected={isConnected}
              liveMessage={liveMessage}
              readReceiptEvent={readReceiptEvent}
              onSendViaSocket={(content) => sendMessage(activeConversation.id, content)}
              onTypingChange={(typing) => sendTyping(activeConversation.id, typing)}
              onMarkRead={() => markRead(activeConversation.id)}
              showBackButton
            />
          ) : (
            <div className="hidden h-full flex-col items-center justify-center gap-2 text-gray-300 lg:flex">
              <MessageCircle size={40} />
              <p className="text-sm">Select a conversation to start chatting</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
