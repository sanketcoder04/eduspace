import { Avatar } from "antd";
import { User as UserIcon } from "lucide-react";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { getOtherParty } from "../utils/chatHelpers";
import { formatRelativeTime } from "@/utils/formatDate";
import PresenceDot from "./PresenceDot";
import type { ConversationResponse } from "../types/chat.types";

interface ConversationListItemProps {
  conversation: ConversationResponse;
  isActive: boolean;
  isOnline: boolean;
  onSelect: () => void;
}

export default function ConversationListItem({
  conversation,
  isActive,
  isOnline,
  onSelect,
}: ConversationListItemProps) {
  const { auth } = useAuth();
  const otherParty = getOtherParty(conversation, auth.user?.id);

  return (
    <button
      type="button"
      onClick={onSelect}
      className={`
        flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition
        ${isActive ? "bg-racing-red-50 dark:bg-racing-red-950" : "hover:bg-gray-50 dark:hover:bg-neutral-800"}
      `}
    >
      <div className="relative shrink-0">
        <Avatar
          size={44}
          src={otherParty.avatarUrl}
          icon={!otherParty.avatarUrl && <UserIcon size={20} />}
        />
        <PresenceDot online={isOnline} />
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between gap-2">
          <p className="truncate text-sm font-semibold text-gray-900 dark:text-white">
            {otherParty.name}
          </p>
          {conversation.lastMessageAt && (
            <span className="shrink-0 text-[11px] text-gray-400">
              {formatRelativeTime(conversation.lastMessageAt)}
            </span>
          )}
        </div>
        <p className="truncate text-xs text-gray-500">{conversation.opportunityTitle}</p>
        {conversation.lastMessagePreview && (
          <p className="truncate text-xs text-gray-400">{conversation.lastMessagePreview}</p>
        )}
        {conversation.status === "CLOSED" && (
          <span className="mt-0.5 inline-block rounded-full bg-gray-100 px-2 py-0.5 text-[10px] text-gray-500 dark:bg-neutral-800">
            Closed
          </span>
        )}
      </div>
    </button>
  );
}
