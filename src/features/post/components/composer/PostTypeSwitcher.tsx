import { POST_TYPE_OPTIONS } from "../../constants/postOptions";
import type { PostType } from "../../types/post.types";

interface PostTypeSwitcherProps {
  value: PostType;
  onChange: (type: PostType) => void;
}

export default function PostTypeSwitcher({ value, onChange }: PostTypeSwitcherProps) {
  return (
    <div className="flex flex-wrap gap-2 border-b border-gray-100 pb-3 dark:border-neutral-800">
      {POST_TYPE_OPTIONS.map(({ value: type, label, icon: Icon }) => (
        <button
          key={type}
          type="button"
          onClick={() => onChange(type)}
          className={`flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-sm font-medium transition ${
            value === type
              ? "bg-racing-red-50 text-racing-red-600 dark:bg-racing-red-950"
              : "text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-neutral-800"
          }`}
        >
          <Icon size={15} />
          {label}
        </button>
      ))}
    </div>
  );
}
