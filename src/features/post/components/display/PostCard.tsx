import { useState } from "react";
import { Card, Avatar, Dropdown, Popconfirm, message } from "antd";
import { Link } from "react-router-dom";
import { User as UserIcon, MoreVertical, Trash2 } from "lucide-react";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { formatRelativeTime } from "@/utils/formatDate";
import { useDeletePost } from "../../hooks/useDeletePost";
import { getErrorMessage } from "@/utils/getErrorMessage";
import PostContent from "./PostContent";
import PostMediaGallery from "./PostMediaGallery";
import PostDocumentCard from "./PostDocumentCard";
import PostPollCard from "./PostPollCard";
import PostActionsBar from "./PostActionsBar";
import { ROUTES } from "@/router/routes";
import type { PostResponse } from "../../types/post.types";
import CommentSection from "../comments/CommentSection";

interface PostCardProps {
  post: PostResponse;
}

export default function PostCard({ post }: PostCardProps) {
  const { auth } = useAuth();
  const [commentsOpen, setCommentsOpen] = useState(false);
  const deleteMutation = useDeletePost();

  const isOwner = auth.user?.id === post.authorId;

  const handleDelete = async () => {
    try {
      await deleteMutation.mutateAsync(post.id);
      message.success("Post deleted.");
    } catch (error) {
      message.error(getErrorMessage(error, "Couldn't delete this post."));
    }
  };

  return (
    <Card className="rounded-2xl shadow-sm" bodyStyle={{ padding: 16 }}>
      <div className="mb-3 flex items-start justify-between gap-3">
        <Link to={ROUTES.PROFILE_BY_ID(post.authorId)} className="flex items-center gap-3">
          <Avatar
            size={40}
            src={post.authorAvatarUrl}
            icon={!post.authorAvatarUrl && <UserIcon size={18} />}
          />
          <div>
            <p className="text-sm font-semibold text-gray-900 hover:underline dark:text-white">
              {post.authorName}
            </p>
            <p className="text-xs text-gray-400">
              {formatRelativeTime(post.createdAt)}
              {post.edited && " · Edited"}
            </p>
          </div>
        </Link>

        {isOwner && (
          <Dropdown
            trigger={["click"]}
            menu={{
              items: [
                {
                  key: "delete",
                  danger: true,
                  label: (
                    <Popconfirm
                      title="Delete this post?"
                      okText="Delete"
                      okButtonProps={{ danger: true }}
                      onConfirm={handleDelete}
                    >
                      <span className="flex items-center gap-2">
                        <Trash2 size={14} /> Delete
                      </span>
                    </Popconfirm>
                  ),
                },
              ],
            }}
          >
            <button
              type="button"
              aria-label="Post options"
              className="text-gray-400 hover:text-gray-600"
            >
              <MoreVertical size={18} />
            </button>
          </Dropdown>
        )}
      </div>

      <div className="space-y-3">
        <PostContent html={post.content} />

        {(post.type === "IMAGE" || post.type === "VIDEO") &&
          post.mediaUrls &&
          post.mediaUrls.length > 0 && (
            <PostMediaGallery mediaUrls={post.mediaUrls} type={post.type} />
          )}

        {post.type === "DOCUMENT" && post.documentUrl && (
          <PostDocumentCard
            documentUrl={post.documentUrl}
            documentFileName={post.documentFileName}
          />
        )}

        {post.type === "POLL" && post.poll && (
          <PostPollCard
            postId={post.id}
            poll={post.poll}
            viewerSelectedOptionIds={post.viewerSelectedOptionIds}
          />
        )}
      </div>

      <div className="mt-3">
        <PostActionsBar
          post={post}
          commentsOpen={commentsOpen}
          onToggleComments={() => setCommentsOpen((prev) => !prev)}
        />
      </div>

      {commentsOpen && <CommentSection postId={post.id} />}
    </Card>
  );
}
