import { useEffect, useRef } from "react";
import { useChatSocketContext } from "../context/ChatSocketContext";
import type {
  MessageResponse,
  ConversationResponse,
  TypingEvent,
  ReadReceiptEvent,
  PresenceEvent,
  WsErrorEvent,
} from "../types/chat.types";

interface ConversationSubscriptionHandlers {
  onMessage?: (message: MessageResponse) => void;
  onConversationUpdate?: (conversation: ConversationResponse) => void;
  onTyping?: (event: TypingEvent) => void;
  onReadReceipt?: (event: ReadReceiptEvent) => void;
  onPresence?: (event: PresenceEvent) => void;
  onError?: (event: WsErrorEvent) => void;
}

/**
 * Subscribes to the five /user/queue/* destinations described in the backend
 * WS design, using whatever ChatSocket the app-wide ChatSocketProvider
 * currently holds. Re-subscribes automatically whenever the connection
 * transitions to "connected" (covers both first mount and any reconnect).
 */
export function useConversationSubscription(handlers: ConversationSubscriptionHandlers) {
  const { connectionState, getSocket } = useChatSocketContext();
  const handlersRef = useRef(handlers);
  handlersRef.current = handlers; // always call the latest handlers without re-subscribing on every render

  useEffect(() => {
    if (connectionState !== "connected") return;

    const socket = getSocket();
    if (!socket) return;

    const subscriptions = [
      socket.subscribe<MessageResponse>("/user/queue/messages", (msg) =>
        handlersRef.current.onMessage?.(msg)
      ),
      socket.subscribe<ConversationResponse>("/user/queue/conversations", (msg) =>
        handlersRef.current.onConversationUpdate?.(msg)
      ),
      socket.subscribe<TypingEvent>("/user/queue/typing", (msg) =>
        handlersRef.current.onTyping?.(msg)
      ),
      socket.subscribe<ReadReceiptEvent>("/user/queue/read-receipts", (msg) =>
        handlersRef.current.onReadReceipt?.(msg)
      ),
      socket.subscribe<PresenceEvent>("/user/queue/presence", (msg) =>
        handlersRef.current.onPresence?.(msg)
      ),
      socket.subscribe<WsErrorEvent>("/user/queue/errors", (msg) =>
        handlersRef.current.onError?.(msg)
      ),
    ];

    return () => {
      subscriptions.forEach((sub) => sub?.unsubscribe());
    };
  }, [connectionState, getSocket]);

  const sendMessage = (conversationId: string, content: string) => {
    getSocket()?.publish(`/app/conversations/${conversationId}/send`, { content });
  };

  const sendTyping = (conversationId: string, typing: boolean) => {
    getSocket()?.publish(`/app/conversations/${conversationId}/typing`, { typing });
  };

  const markRead = (conversationId: string) => {
    getSocket()?.publish(`/app/conversations/${conversationId}/read`, {});
  };

  return { sendMessage, sendTyping, markRead, isConnected: connectionState === "connected" };
}
