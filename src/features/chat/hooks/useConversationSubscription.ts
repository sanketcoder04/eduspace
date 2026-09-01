import { useEffect, useRef } from "react";
import { useChatSocketContext } from "./useChatSocketContext";
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

export function useConversationSubscription(handlers: ConversationSubscriptionHandlers) {
  const { connectionState, getSocket } = useChatSocketContext();

  const handlersRef = useRef(handlers);

  useEffect(() => {
    handlersRef.current = handlers;
  });

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

    // This effect runs on EVERY mount while already connected (e.g. opening
    // the Chat page long after the socket first connected), and again on
    // every reconnect — both cases the old connect-time-only snapshot
    // missed. Requesting a fresh snapshot here means presence is always
    // correct the moment something is actually listening for it, instead of
    // depending on a connect event that may have happened minutes earlier.
    socket.publish("/app/presence/refresh", {});

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
