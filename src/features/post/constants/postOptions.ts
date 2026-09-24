import { Type, Image as ImageIcon, Video, FileText, ListChecks } from "lucide-react";
import type { PostType } from "../types/post.types";

export const POST_TYPE_OPTIONS: { value: PostType; label: string; icon: typeof Type }[] = [
  { value: "TEXT", label: "Text", icon: Type },
  { value: "IMAGE", label: "Photo", icon: ImageIcon },
  { value: "VIDEO", label: "Video", icon: Video },
  { value: "DOCUMENT", label: "Document", icon: FileText },
  { value: "POLL", label: "Poll", icon: ListChecks },
];

export const POLL_DURATION_OPTIONS = [
  { label: "1 day", value: 1 },
  { label: "3 days", value: 3 },
  { label: "1 week", value: 7 },
  { label: "2 weeks", value: 14 },
  { label: "No expiry", value: 0 },
] as const;

export const MAX_IMAGES_PER_POST = 4;
export const MAX_POLL_OPTIONS = 6;
