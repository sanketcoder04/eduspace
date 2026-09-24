import { useRef, useState } from "react";
import { Modal, message, Avatar } from "antd";
import { User as UserIcon } from "lucide-react";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { useMyProfile } from "@/features/profile/hooks/useMyProfile";
import { useCreatePost } from "../../hooks/useCreatePost";
import { getErrorMessage } from "@/utils/getErrorMessage";
import RichTextEditor, { type RichTextEditorRef } from "../editor/RichTextEditor";
import PostTypeSwitcher from "./PostTypeSwitcher";
import MediaUploadPanel from "./MediaUploadPanel";
import DocumentUploadPanel from "./DocumentUploadPanel";
import PollBuilder from "./PollBuilder";
import type { PostType } from "../../types/post.types";

interface PostComposerModalProps {
  open: boolean;
  onClose: () => void;
}

export default function PostComposerModal({ open, onClose }: PostComposerModalProps) {
  const { auth } = useAuth();
  const { profile } = useMyProfile();
  const createMutation = useCreatePost();

  const editorRef = useRef<RichTextEditorRef>(null);

  const [type, setType] = useState<PostType>("TEXT");
  const [content, setContent] = useState("");
  const [mediaUrls, setMediaUrls] = useState<string[]>([]);
  const [documentUrl, setDocumentUrl] = useState<string>();
  const [documentFileName, setDocumentFileName] = useState<string>();
  const [pollOptions, setPollOptions] = useState<string[]>(["", ""]);
  const [pollAllowMultipleChoice, setPollAllowMultipleChoice] = useState(false);
  const [pollDurationDays, setPollDurationDays] = useState(7);

  const resetAll = () => {
    setType("TEXT");
    setContent("");
    setMediaUrls([]);
    setDocumentUrl(undefined);
    setDocumentFileName(undefined);
    setPollOptions(["", ""]);
    setPollAllowMultipleChoice(false);
    setPollDurationDays(7);
    editorRef.current?.clear();
  };

  const handleClose = () => {
    resetAll();
    onClose();
  };

  const isValid = () => {
    switch (type) {
      case "TEXT":
        return !editorRef.current?.isEmpty();
      case "IMAGE":
      case "VIDEO":
        return mediaUrls.length > 0;
      case "DOCUMENT":
        return !!documentUrl;
      case "POLL":
        return pollOptions.filter((o) => o.trim()).length >= 2;
    }
  };

  const handleSubmit = async () => {
    if (!isValid()) {
      message.warning("Please complete this post before publishing.");
      return;
    }

    try {
      await createMutation.mutateAsync({
        type,
        content: content || undefined,
        mediaUrls: type === "IMAGE" || type === "VIDEO" ? mediaUrls : undefined,
        documentUrl: type === "DOCUMENT" ? documentUrl : undefined,
        documentFileName: type === "DOCUMENT" ? documentFileName : undefined,
        pollOptions: type === "POLL" ? pollOptions.filter((o) => o.trim()) : undefined,
        pollAllowMultipleChoice: type === "POLL" ? pollAllowMultipleChoice : undefined,
        pollExpiresAt:
          type === "POLL" && pollDurationDays > 0
            ? new Date(Date.now() + pollDurationDays * 86_400_000).toISOString()
            : undefined,
      });
      message.success("Post published.");
      handleClose();
    } catch (error) {
      message.error(getErrorMessage(error, "Couldn't publish this post. Please try again."));
    }
  };

  const avatarUrl = profile && "avatarUrl" in profile ? profile.avatarUrl : undefined;

  return (
    <Modal
      title="Create a post"
      open={open}
      onCancel={handleClose}
      onOk={handleSubmit}
      okText="Post"
      okButtonProps={{ loading: createMutation.isPending, className: "rounded-xl font-semibold" }}
      cancelButtonProps={{ className: "rounded-xl" }}
      centered
      width={560}
      destroyOnHidden
    >
      <div className="mb-4 flex items-center gap-3">
        <Avatar size={40} src={avatarUrl} icon={!avatarUrl && <UserIcon size={18} />} />
        <span className="text-sm font-semibold text-gray-900 dark:text-white">
          {profile?.name ?? auth.user?.email}
        </span>
      </div>

      <PostTypeSwitcher value={type} onChange={setType} />

      <div className="mt-4 space-y-4">
        {type !== "POLL" && (
          <RichTextEditor
            ref={editorRef}
            onChange={setContent}
            placeholder={type === "TEXT" ? "What's on your mind?" : "Add a caption (optional)..."}
            minHeightClassName={type === "TEXT" ? "min-h-[120px]" : "min-h-[70px]"}
          />
        )}

        {(type === "IMAGE" || type === "VIDEO") && (
          <MediaUploadPanel type={type} mediaUrls={mediaUrls} onChange={setMediaUrls} />
        )}

        {type === "DOCUMENT" && (
          <DocumentUploadPanel
            documentUrl={documentUrl}
            documentFileName={documentFileName}
            onChange={(url, name) => {
              setDocumentUrl(url);
              setDocumentFileName(name);
            }}
          />
        )}

        {type === "POLL" && (
          <>
            <input
              value={content.replace(/<[^>]*>/g, "")}
              onChange={(e) => setContent(e.target.value ? `<p>${e.target.value}</p>` : "")}
              placeholder="Ask a question..."
              maxLength={200}
              className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm outline-none focus:border-racing-red-400 dark:border-neutral-700 dark:bg-neutral-800 dark:text-white"
            />
            <PollBuilder
              options={pollOptions}
              onOptionsChange={setPollOptions}
              allowMultipleChoice={pollAllowMultipleChoice}
              onAllowMultipleChoiceChange={setPollAllowMultipleChoice}
              durationDays={pollDurationDays}
              onDurationDaysChange={setPollDurationDays}
            />
          </>
        )}
      </div>
    </Modal>
  );
}
