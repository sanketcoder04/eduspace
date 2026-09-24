import { useRef, useState } from "react";
import { Avatar, message } from "antd";
import { User as UserIcon, Send } from "lucide-react";
import { useMyProfile } from "@/features/profile/hooks/useMyProfile";
import { useCreateComment } from "../../hooks/useCreateComment";
import { getErrorMessage } from "@/utils/getErrorMessage";
import RichTextEditor, { type RichTextEditorRef } from "../editor/RichTextEditor";

interface CommentComposerProps {
  postId: string;
  parentCommentId?: string;
  onPosted?: () => void;
  autoFocus?: boolean;
}

export default function CommentComposer({
  postId,
  parentCommentId,
  onPosted,
}: CommentComposerProps) {
  const { profile } = useMyProfile();
  const editorRef = useRef<RichTextEditorRef>(null);
  const [content, setContent] = useState("");
  const createMutation = useCreateComment();

  const avatarUrl = profile && "avatarUrl" in profile ? profile.avatarUrl : undefined;

  const handleSubmit = async () => {
    if (editorRef.current?.isEmpty()) return;

    try {
      await createMutation.mutateAsync({ postId, payload: { content, parentCommentId } });
      editorRef.current?.clear();
      setContent("");
      onPosted?.();
    } catch (error) {
      message.error(getErrorMessage(error, "Couldn't post your comment."));
    }
  };

  return (
    <div className="flex items-start gap-2">
      <Avatar size={32} src={avatarUrl} icon={!avatarUrl && <UserIcon size={14} />} />
      <div className="flex-1">
        <RichTextEditor
          ref={editorRef}
          onChange={setContent}
          placeholder={parentCommentId ? "Write a reply..." : "Write a comment..."}
          minHeightClassName="min-h-[36px]"
          showToolbar={false}
        />
      </div>
      <button
        type="button"
        onClick={handleSubmit}
        disabled={createMutation.isPending}
        aria-label="Post"
        className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-racing-red-500 text-white transition hover:bg-racing-red-600 disabled:opacity-40"
      >
        <Send size={14} />
      </button>
    </div>
  );
}
