import { Heart, MessageCircle, Share2 } from "lucide-react";
import { message } from "antd";
import { useTogglePostLike } from "../../hooks/useTogglePostLike";
import { ROUTES } from "@/router/routes";
import type { PostResponse } from "../../types/post.types";

interface PostActionsBarProps {
  post: PostResponse;
  onToggleComments: () => void;
  commentsOpen: boolean;
}

export default function PostActionsBar({
  post,
  onToggleComments,
  commentsOpen,
}: PostActionsBarProps) {
  const toggleLikeMutation = useTogglePostLike();

  const handleShare = async () => {
    const url = `${window.location.origin}${ROUTES.POST_DETAIL(post.id)}`;
    await navigator.clipboard.writeText(url);
    message.success("Post link copied to clipboard.");
  };

  return (
    <div className="flex items-center justify-between border-t border-gray-100 pt-2 dark:border-neutral-800">
      <button
        type="button"
        onClick={() => toggleLikeMutation.mutate(post.id)}
        className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium transition ${
          post.likedByViewer
            ? "text-racing-red-600"
            : "text-gray-500 hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-neutral-800"
        }`}
      >
        <Heart size={16} fill={post.likedByViewer ? "currentColor" : "none"} />
        {post.likesCount > 0 ? post.likesCount : "Like"}
      </button>

      <button
        type="button"
        onClick={onToggleComments}
        className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium transition ${
          commentsOpen
            ? "text-racing-red-600"
            : "text-gray-500 hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-neutral-800"
        }`}
      >
        <MessageCircle size={16} />
        {post.commentsCount > 0 ? post.commentsCount : "Comment"}
      </button>

      <button
        type="button"
        onClick={handleShare}
        className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium text-gray-500 transition hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-neutral-800"
      >
        <Share2 size={16} />
        Share
      </button>
    </div>
  );
}
