import { useState } from "react";
import { Avatar, Popconfirm, message } from "antd";
import { Link } from "react-router-dom";
import { User as UserIcon, Heart, Trash2 } from "lucide-react";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { formatRelativeTime } from "@/utils/formatDate";
import { useToggleCommentLike } from "../../hooks/useToggleCommentLike";
import { useDeleteComment } from "../../hooks/useDeleteComment";
import { useReplies } from "../../hooks/useReplies";
import { getErrorMessage } from "@/utils/getErrorMessage";
import PostContent from "../display/PostContent";
import CommentComposer from "./CommentComposer";
import { ROUTES } from "@/router/routes";
import type { CommentResponse } from "../../types/post.types";

interface CommentItemProps {
  comment: CommentResponse;
  postId: string;
}

export default function CommentItem({ comment, postId }: CommentItemProps) {
  const { auth } = useAuth();
  const [repliesOpen, setRepliesOpen] = useState(false);
  const [replyBoxOpen, setReplyBoxOpen] = useState(false);

  const toggleLikeMutation = useToggleCommentLike();
  const deleteMutation = useDeleteComment();
  const { data: repliesPage } = useReplies(comment.id, repliesOpen);

  const isOwner = auth.user?.id === comment.authorId;

  const handleDelete = async () => {
    try {
      await deleteMutation.mutateAsync(comment.id);
    } catch (error) {
      message.error(getErrorMessage(error, "Couldn't delete this comment."));
    }
  };

  return (
    <div className="flex gap-2">
      <Link to={ROUTES.PROFILE_BY_ID(comment.authorId)}>
        <Avatar
          size={32}
          src={comment.authorAvatarUrl}
          icon={!comment.authorAvatarUrl && <UserIcon size={14} />}
        />
      </Link>

      <div className="min-w-0 flex-1">
        <div className="rounded-2xl bg-gray-50 px-3 py-2 dark:bg-neutral-800">
          <Link
            to={ROUTES.PROFILE_BY_ID(comment.authorId)}
            className="text-xs font-semibold text-gray-900 hover:underline dark:text-white"
          >
            {comment.authorName}
          </Link>
          <PostContent html={comment.content} className="text-sm" />
        </div>

        <div className="mt-1 flex items-center gap-3 pl-3 text-xs text-gray-400">
          <span>{formatRelativeTime(comment.createdAt)}</span>
          <button
            type="button"
            onClick={() => toggleLikeMutation.mutate(comment.id)}
            className={`flex items-center gap-1 font-medium ${comment.likedByViewer ? "text-racing-red-600" : ""}`}
          >
            <Heart size={12} fill={comment.likedByViewer ? "currentColor" : "none"} />
            {comment.likesCount > 0 ? comment.likesCount : "Like"}
          </button>
          {!comment.parentCommentId && (
            <button
              type="button"
              onClick={() => setReplyBoxOpen((prev) => !prev)}
              className="font-medium"
            >
              Reply
            </button>
          )}
          {isOwner && (
            <Popconfirm
              title="Delete this comment?"
              okText="Delete"
              okButtonProps={{ danger: true }}
              onConfirm={handleDelete}
            >
              <button
                type="button"
                className="flex items-center gap-1 font-medium text-gray-400 hover:text-racing-red-600"
              >
                <Trash2 size={12} />
              </button>
            </Popconfirm>
          )}
        </div>

        {replyBoxOpen && (
          <div className="mt-2 pl-3">
            <CommentComposer
              postId={postId}
              parentCommentId={comment.id}
              onPosted={() => {
                setReplyBoxOpen(false);
                setRepliesOpen(true);
              }}
            />
          </div>
        )}

        {comment.repliesCount > 0 && (
          <button
            type="button"
            onClick={() => setRepliesOpen((prev) => !prev)}
            className="mt-1 pl-3 text-xs font-medium text-racing-red-600 hover:underline"
          >
            {repliesOpen
              ? "Hide replies"
              : `View ${comment.repliesCount} repl${comment.repliesCount === 1 ? "y" : "ies"}`}
          </button>
        )}

        {repliesOpen && repliesPage && (
          <div className="mt-2 space-y-3 border-l-2 border-gray-100 pl-3 dark:border-neutral-800">
            {repliesPage.content.map((reply) => (
              <CommentItem key={reply.id} comment={reply} postId={postId} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
