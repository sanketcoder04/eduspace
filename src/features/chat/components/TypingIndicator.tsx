interface TypingIndicatorProps {
  typingUserName?: string;
}

export default function TypingIndicator({ typingUserName }: TypingIndicatorProps) {
  if (!typingUserName) return null;

  return (
    <div className="flex items-center gap-1 px-4 py-1 text-xs text-gray-400">
      <span>{typingUserName} is typing</span>
      <span className="flex gap-0.5">
        <span className="h-1 w-1 animate-bounce rounded-full bg-gray-400 [animation-delay:0ms]" />
        <span className="h-1 w-1 animate-bounce rounded-full bg-gray-400 [animation-delay:150ms]" />
        <span className="h-1 w-1 animate-bounce rounded-full bg-gray-400 [animation-delay:300ms]" />
      </span>
    </div>
  );
}
