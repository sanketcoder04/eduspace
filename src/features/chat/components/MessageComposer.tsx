import { useRef, useState } from "react";
import { Send } from "lucide-react";

interface MessageComposerProps {
  disabled?: boolean;
  disabledReason?: string;
  onSend: (content: string) => void;
  onTypingChange: (typing: boolean) => void;
}

const TYPING_STOP_DELAY_MS = 2000;

export default function MessageComposer({
  disabled,
  disabledReason,
  onSend,
  onTypingChange,
}: MessageComposerProps) {
  const [value, setValue] = useState("");
  const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isTypingRef = useRef(false);

  const stopTyping = () => {
    if (isTypingRef.current) {
      isTypingRef.current = false;
      onTypingChange(false);
    }
  };

  const handleChange = (text: string) => {
    setValue(text);

    if (!isTypingRef.current) {
      isTypingRef.current = true;
      onTypingChange(true);
    }

    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(stopTyping, TYPING_STOP_DELAY_MS);
  };

  const handleSend = () => {
    const trimmed = value.trim();
    if (!trimmed || disabled) return;

    onSend(trimmed);
    setValue("");
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    stopTyping();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  if (disabled) {
    return (
      <div className="border-t border-gray-100 px-4 py-3 text-center text-xs text-gray-400 dark:border-neutral-800">
        {disabledReason ?? "This conversation is closed."}
      </div>
    );
  }

  return (
    <div className="flex items-end gap-2 border-t border-gray-100 p-3 dark:border-neutral-800">
      <textarea
        value={value}
        onChange={(e) => handleChange(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Type a message..."
        rows={1}
        className="max-h-32 flex-1 resize-none rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-sm outline-none focus:border-racing-red-400 dark:border-neutral-700 dark:bg-neutral-800 dark:text-white"
      />
      <button
        type="button"
        onClick={handleSend}
        disabled={!value.trim()}
        aria-label="Send message"
        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-racing-red-500 text-white transition hover:bg-racing-red-600 disabled:opacity-40"
      >
        <Send size={16} />
      </button>
    </div>
  );
}
