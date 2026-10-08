import { Link } from "react-router-dom";
import { Heart, MessageCircle, FileText, ListChecks, Video } from "lucide-react";
import { formatRelativeTime } from "@/utils/formatDate";
import { ROUTES } from "@/router/routes";
import type { PostResponse } from "../../types/post.types";

function stripHtml(html?: string): string {
  if (!html) return "";
  return html.replace(/<[^>]*>/g, "").trim();
}

interface PostPreviewCardProps {
  post: PostResponse;
}

export default function PostPreviewCard({ post }: PostPreviewCardProps) {
  return (
    <Link
      to={ROUTES.POST_DETAIL(post.id)}
      className="flex w-56 shrink-0 flex-col overflow-hidden rounded-xl border border-gray-200 bg-white transition hover:border-racing-red-300 hover:shadow-sm dark:border-neutral-700 dark:bg-neutral-900"
    >
      <div className="h-32 w-full shrink-0 bg-gray-50 dark:bg-neutral-800">
        {post.type === "IMAGE" && post.mediaUrls?.[0] ? (
          <img src={post.mediaUrls[0]} alt="" className="h-full w-full object-cover" />
        ) : post.type === "VIDEO" && post.mediaUrls?.[0] ? (
          <div className="relative h-full w-full">
            <video src={post.mediaUrls[0]} className="h-full w-full object-cover" />
            <span className="absolute inset-0 flex items-center justify-center bg-black/20">
              <Video size={24} className="text-white" />
            </span>
          </div>
        ) : post.type === "DOCUMENT" ? (
          <div className="flex h-full w-full flex-col items-center justify-center gap-1 text-racing-red-400">
            <FileText size={28} />
            <span className="px-2 text-center text-[11px] text-gray-400 line-clamp-1">
              {post.documentFileName}
            </span>
          </div>
        ) : post.type === "POLL" ? (
          <div className="flex h-full w-full flex-col items-center justify-center gap-1 text-racing-red-400">
            <ListChecks size={28} />
            <span className="px-3 text-center text-xs text-gray-500 line-clamp-2">
              {stripHtml(post.content) || "Poll"}
            </span>
          </div>
        ) : (
          <div className="flex h-full w-full items-center p-3">
            <p className="line-clamp-4 text-xs text-gray-600 dark:text-gray-300">
              {stripHtml(post.content)}
            </p>
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-1.5 p-3">
        <p className="text-[11px] text-gray-400">{formatRelativeTime(post.createdAt)}</p>
        <div className="mt-auto flex items-center gap-3 text-xs text-gray-500">
          <span className="flex items-center gap-1">
            <Heart size={12} className="text-racing-red-500" />
            {post.likesCount}
          </span>
          <span className="flex items-center gap-1">
            <MessageCircle size={12} className="text-racing-red-500" />
            {post.commentsCount}
          </span>
        </div>
      </div>
    </Link>
  );
}
