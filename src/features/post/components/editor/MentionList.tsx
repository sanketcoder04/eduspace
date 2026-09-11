import { forwardRef, useEffect, useImperativeHandle, useState } from "react";
import { User as UserIcon } from "lucide-react";
import type { MentionCandidate } from "../../types/post.types";

export interface MentionListRef {
  onKeyDown: (props: { event: KeyboardEvent }) => boolean;
}

interface MentionListProps {
  items: MentionCandidate[];
  command: (item: { id: string; label: string }) => void;
}

const MentionList = forwardRef<MentionListRef, MentionListProps>(({ items, command }, ref) => {
  const [selectedIndex, setSelectedIndex] = useState(0);

  useEffect(() => setSelectedIndex(0), [items]);

  const selectItem = (index: number) => {
    const item = items[index];
    if (item) command({ id: item.id, label: item.name });
  };

  useImperativeHandle(ref, () => ({
    onKeyDown: ({ event }) => {
      if (event.key === "ArrowUp") {
        setSelectedIndex((prev) => (prev + items.length - 1) % items.length);
        return true;
      }
      if (event.key === "ArrowDown") {
        setSelectedIndex((prev) => (prev + 1) % items.length);
        return true;
      }
      if (event.key === "Enter") {
        selectItem(selectedIndex);
        return true;
      }
      return false;
    },
  }));

  if (items.length === 0) {
    return (
      <div className="rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm text-gray-400 shadow-lg dark:border-neutral-700 dark:bg-neutral-900">
        No matching users
      </div>
    );
  }

  return (
    <div className="max-h-60 overflow-y-auto rounded-xl border border-gray-200 bg-white p-1 shadow-lg dark:border-neutral-700 dark:bg-neutral-900">
      {items.map((item, index) => (
        <button
          key={item.id}
          type="button"
          onClick={() => selectItem(index)}
          className={`flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-left text-sm ${
            index === selectedIndex
              ? "bg-racing-red-50 text-racing-red-600 dark:bg-racing-red-950"
              : "text-gray-700 dark:text-gray-200"
          }`}
        >
          <UserIcon size={14} className="shrink-0 text-gray-400" />
          <span className="truncate">{item.name}</span>
          <span className="ml-auto shrink-0 text-xs text-gray-400">
            {item.role === "TEACHER" ? "Teacher" : "Student"}
          </span>
        </button>
      ))}
    </div>
  );
});

MentionList.displayName = "MentionList";
export default MentionList;
