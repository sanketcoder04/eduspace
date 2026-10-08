import { Link } from "react-router-dom";
import { Heart, MessageCircle, Video } from "lucide-react";
import { formatRelativeTime } from "@/utils/formatDate";
import { ROUTES } from "@/router/routes";
import type { PostResponse } from "../../types/post.types";
import DocumentPreview from "@/features/profile/components/display/DocumentPreview";
import { Progress } from "antd";
import { htmlToPlainText } from "@/utils/htmlToPlainText";

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
            <DocumentPreview url={post.documentUrl as string} />
          </div>
        ) : post.type === "POLL" ? (
          <div className="flex flex-col p-2 h-full w-full justify-center gap-1 text-racing-red-400">
            <span className="flex gap-0.5 text-xs text-gray-500 line-clamp-2">
              {htmlToPlainText(post.content) || "Poll"}
            </span>
            {post.poll ? (
              <span className="flex flex-col gap-1">
                {post.poll.options.map((option) => (
                  <span key={option.id} className="text-xs grid grid-cols-2 truncate">
                    {option.text}
                    <Progress percent={option.votePercentage} size="small" />
                  </span>
                ))}
              </span>
            ) : null}
          </div>
        ) : (
          <div className="flex h-full w-full p-2">
            <p className="line-clamp-2 text-xs text-gray-600 dark:text-gray-300">
              {htmlToPlainText(post.content)}
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
