import { useState } from "react";
import type { Editor } from "@tiptap/react";
import { Bold, Underline, List, ListOrdered, Smile } from "lucide-react";
import { Popover } from "antd";

const COMMON_EMOJIS = [
  "😀",
  "😂",
  "😍",
  "🥳",
  "👍",
  "🙏",
  "🔥",
  "🎉",
  "😢",
  "😮",
  "❤️",
  "👏",
  "🤔",
  "😎",
  "💯",
  "✨",
];

interface EditorToolbarProps {
  editor: Editor;
}

function ToolbarButton({
  active,
  onClick,
  children,
  label,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
  label: string;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className={`flex h-8 w-8 items-center justify-center rounded-lg transition ${
        active
          ? "bg-racing-red-50 text-racing-red-600 dark:bg-racing-red-950"
          : "text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-neutral-800"
      }`}
    >
      {children}
    </button>
  );
}

export default function EditorToolbar({ editor }: EditorToolbarProps) {
  const [emojiOpen, setEmojiOpen] = useState(false);

  const insertEmoji = (emoji: string) => {
    editor.chain().focus().insertContent(emoji).run();
    setEmojiOpen(false);
  };

  return (
    <div className="flex items-center gap-1 border-b border-gray-100 px-2 py-1.5 dark:border-neutral-800">
      <ToolbarButton
        label="Bold"
        active={editor.isActive("bold")}
        onClick={() => editor.chain().focus().toggleBold().run()}
      >
        <Bold size={16} />
      </ToolbarButton>

      <ToolbarButton
        label="Underline"
        active={editor.isActive("underline")}
        onClick={() => editor.chain().focus().toggleUnderline().run()}
      >
        <Underline size={16} />
      </ToolbarButton>

      <ToolbarButton
        label="Bullet list"
        active={editor.isActive("bulletList")}
        onClick={() => editor.chain().focus().toggleBulletList().run()}
      >
        <List size={16} />
      </ToolbarButton>

      <ToolbarButton
        label="Numbered list"
        active={editor.isActive("orderedList")}
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
      >
        <ListOrdered size={16} />
      </ToolbarButton>

      <Popover
        open={emojiOpen}
        onOpenChange={setEmojiOpen}
        trigger="click"
        content={
          <div className="grid grid-cols-8 gap-1 p-1">
            {COMMON_EMOJIS.map((emoji) => (
              <button
                key={emoji}
                type="button"
                onClick={() => insertEmoji(emoji)}
                className="rounded-lg p-1.5 text-lg hover:bg-gray-100 dark:hover:bg-neutral-800"
              >
                {emoji}
              </button>
            ))}
          </div>
        }
      >
        <span>
          <ToolbarButton label="Emoji" active={false} onClick={() => setEmojiOpen((prev) => !prev)}>
            <Smile size={16} />
          </ToolbarButton>
        </span>
      </Popover>
    </div>
  );
}
