import { Check, CheckCheck } from "lucide-react";
import type { MessageResponse } from "../types/chat.types";

interface MessageBubbleProps {
  message: MessageResponse;
  isOwn: boolean;
}

export default function MessageBubble({ message, isOwn }: MessageBubbleProps) {
  if (message.type === "SYSTEM" || message.type === "CONTACT_SHARE_UPDATE") {
    return (
      <div className="flex justify-center py-1">
        <span className="rounded-full bg-gray-100 px-3 py-1 text-xs text-gray-500 dark:bg-neutral-800 dark:text-gray-400">
          {message.content}
        </span>
      </div>
    );
  }

  const time = new Date(message.createdAt).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className={`flex ${isOwn ? "justify-end" : "justify-start"} px-1 py-0.5`}>
      <div
        className={`
          max-w-[75%] rounded-2xl px-4 py-2 text-sm
          ${
            isOwn
              ? "rounded-br-md bg-racing-red-500 text-white"
              : "rounded-bl-md bg-gray-100 text-gray-800 dark:bg-neutral-800 dark:text-gray-100"
          }
        `}
      >
        <p className="whitespace-pre-line wrap-break-word">{message.content}</p>
        <div
          className={`mt-1 flex items-center justify-end gap-1 text-[10px] ${
            isOwn ? "text-white/70" : "text-gray-400"
          }`}
        >
          <span>{time}</span>
          {isOwn && (message.read ? <CheckCheck size={12} /> : <Check size={12} />)}
        </div>
      </div>
    </div>
  );
}
