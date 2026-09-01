import { useEffect, useRef, useState } from "react";
import { Avatar, Button, message as toast } from "antd";
import { User as UserIcon, ArrowLeft, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { getOtherParty } from "../utils/chatHelpers";
import { getMessages, sendMessageViaRest } from "../services/chat.service";
import MessageBubble from "./MessageBubble";
import MessageComposer from "./MessageComposer";
import TypingIndicator from "./TypingIndicator";
import PresenceDot from "./PresenceDot";
import { getErrorMessage } from "@/utils/getErrorMessage";
import type { ConversationResponse, MessageResponse } from "../types/chat.types";
import { ROUTES } from "@/router/routes";

interface ConversationThreadProps {
  conversation: ConversationResponse;
  isOtherPartyOnline: boolean;
  isOtherPartyTyping: boolean;
  isSocketConnected: boolean;
  liveMessage: MessageResponse | null;
  onSendViaSocket: (content: string) => void;
  onTypingChange: (typing: boolean) => void;
  onMarkRead: () => void;
  showBackButton?: boolean;
}

const PAGE_SIZE = 30;

/** Scrolls to the bottom on the frame AFTER the browser has actually laid
 * out/painted whatever just got added — a bare scrollIntoView() called
 * synchronously in an effect can run before the new bubble's height is
 * reflected in scrollHeight, landing short of the true bottom. Two nested
 * rAFs (not one) reliably land after paint across browsers. */
function scrollToBottomNextFrame(el: HTMLDivElement | null) {
  if (!el) return;
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      el.scrollTop = el.scrollHeight;
    });
  });
}

export default function ConversationThread({
  conversation,
  isOtherPartyOnline,
  isOtherPartyTyping,
  isSocketConnected,
  liveMessage,
  onSendViaSocket,
  onTypingChange,
  onMarkRead,
  showBackButton,
}: ConversationThreadProps) {
  const { auth } = useAuth();
  const otherParty = getOtherParty(conversation, auth.user?.id);

  const [messages, setMessages] = useState<MessageResponse[]>([]);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [isLoadingInitial, setIsLoadingInitial] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const isFirstLoadRef = useRef(true);
  // Tracks locally-composed optimistic message ids so the real one arriving
  // over WS can replace (not duplicate) it once the round trip completes.
  const pendingLocalIdsRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    let cancelled = false;
    setIsLoadingInitial(true);
    setMessages([]);
    setPage(0);
    setHasMore(true);
    isFirstLoadRef.current = true;

    getMessages(conversation.id, { page: 0, size: PAGE_SIZE })
      .then((result) => {
        if (cancelled) return;
        setMessages([...result.content].reverse());
        setHasMore(!result.last);
      })
      .finally(() => {
        if (!cancelled) setIsLoadingInitial(false);
      });

    return () => {
      cancelled = true;
    };
  }, [conversation.id]);

  useEffect(() => {
    if (!isLoadingInitial && isFirstLoadRef.current) {
      scrollToBottomNextFrame(scrollContainerRef.current);
      isFirstLoadRef.current = false;
    }
  }, [isLoadingInitial]);

  useEffect(() => {
    if (!liveMessage || liveMessage.conversationId !== conversation.id) return;

    setMessages((prev) => {
      // Already have this id (e.g. it's the optimistic placeholder for a
      // message WE just sent, now confirmed by the server) — replace it in
      // place rather than appending a duplicate.
      const existingIndex = prev.findIndex((m) => m.id === liveMessage.id);
      if (existingIndex !== -1) {
        const next = [...prev];
        next[existingIndex] = liveMessage;
        return next;
      }

      // Our own optimistic bubble used a temporary id, so the confirmed
      // message arrives under a DIFFERENT id — match it by sender+content
      // instead and swap it in, so we don't end up with both the temp
      // bubble AND the server-confirmed one on screen at once.
      if (liveMessage.senderId === auth.user?.id) {
        const tempIndex = prev.findIndex(
          (m) => pendingLocalIdsRef.current.has(m.id) && m.content === liveMessage.content
        );
        if (tempIndex !== -1) {
          pendingLocalIdsRef.current.delete(prev[tempIndex].id);
          const next = [...prev];
          next[tempIndex] = liveMessage;
          return next;
        }
      }

      return [...prev, liveMessage];
    });

    scrollToBottomNextFrame(scrollContainerRef.current);

    if (liveMessage.senderId && liveMessage.senderId !== auth.user?.id) {
      onMarkRead();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [liveMessage, conversation.id]);

  useEffect(() => {
    onMarkRead();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [conversation.id]);

  const loadOlder = async () => {
    setIsLoadingMore(true);
    try {
      const nextPage = page + 1;
      const result = await getMessages(conversation.id, { page: nextPage, size: PAGE_SIZE });
      const container = scrollContainerRef.current;
      const prevScrollHeight = container?.scrollHeight ?? 0;

      setMessages((prev) => [...[...result.content].reverse(), ...prev]);
      setHasMore(!result.last);
      setPage(nextPage);

      requestAnimationFrame(() => {
        if (container) {
          container.scrollTop = container.scrollHeight - prevScrollHeight;
        }
      });
    } catch (error) {
      toast.error(getErrorMessage(error, "Couldn't load earlier messages."));
    } finally {
      setIsLoadingMore(false);
    }
  };

  const handleSend = async (content: string) => {
    // Render our own message INSTANTLY, before the network round trip —
    // this is what actually fixes "I have to scroll to see what I just
    // typed": we no longer wait on the server/broadcast at all to show it.
    const optimisticId = `local-${Date.now()}-${Math.random().toString(36).slice(2)}`;
    pendingLocalIdsRef.current.add(optimisticId);

    const optimisticMessage: MessageResponse = {
      id: optimisticId,
      conversationId: conversation.id,
      senderId: auth.user?.id,
      senderName: auth.user?.email,
      type: "TEXT",
      content,
      read: false,
      createdAt: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, optimisticMessage]);
    scrollToBottomNextFrame(scrollContainerRef.current);

    if (isSocketConnected) {
      onSendViaSocket(content);
      return;
    }

    try {
      const sent = await sendMessageViaRest(conversation.id, { content });
      setMessages((prev) => prev.map((m) => (m.id === optimisticId ? sent : m)));
      pendingLocalIdsRef.current.delete(optimisticId);
      scrollToBottomNextFrame(scrollContainerRef.current);
    } catch (error) {
      // Failed to send — drop the optimistic bubble rather than leave a
      // message on screen that never actually reached the other party.
      setMessages((prev) => prev.filter((m) => m.id !== optimisticId));
      pendingLocalIdsRef.current.delete(optimisticId);
      toast.error(getErrorMessage(error, "Couldn't send your message. Please try again."));
    }
  };

  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="flex shrink-0 items-center gap-3 border-b border-gray-100 px-4 py-3 dark:border-neutral-800">
        {showBackButton && (
          <Link to={ROUTES.CONVERSATIONS} className="text-gray-500 lg:hidden">
            <ArrowLeft size={20} />
          </Link>
        )}
        <div className="relative">
          <Avatar
            size={40}
            src={otherParty.avatarUrl}
            icon={!otherParty.avatarUrl && <UserIcon size={18} />}
          />
          <PresenceDot online={isOtherPartyOnline} />
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold text-gray-900 dark:text-white">
            {otherParty.name}
          </p>
          <p className="truncate text-xs text-gray-400">
            {isOtherPartyOnline ? "Online" : "Offline"} · {conversation.opportunityTitle}
          </p>
        </div>
      </div>

      <div ref={scrollContainerRef} className="min-h-0 flex-1 overflow-y-auto px-2 py-3">
        {hasMore && !isLoadingInitial && (
          <div className="flex justify-center pb-2">
            <Button size="small" loading={isLoadingMore} onClick={loadOlder} className="rounded-lg">
              Load earlier messages
            </Button>
          </div>
        )}

        {isLoadingInitial ? (
          <div className="flex h-full items-center justify-center">
            <Loader2 size={20} className="animate-spin text-gray-300" />
          </div>
        ) : (
          messages.map((message) => (
            <MessageBubble
              key={message.id}
              message={message}
              isOwn={message.senderId === auth.user?.id}
            />
          ))
        )}
      </div>

      <div className="shrink-0">
        <TypingIndicator typingUserName={isOtherPartyTyping ? otherParty.name : undefined} />
      </div>

      <div className="shrink-0">
        <MessageComposer
          disabled={conversation.status === "CLOSED"}
          disabledReason="This application is closed — the conversation is read-only."
          onSend={handleSend}
          onTypingChange={(typing) => onTypingChange(typing)}
        />
      </div>
    </div>
  );
}
