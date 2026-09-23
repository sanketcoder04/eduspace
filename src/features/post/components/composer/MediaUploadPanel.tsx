import { useRef } from "react";
import { message } from "antd";
import { Plus, X, Loader2 } from "lucide-react";
import { useUploadMedia } from "@/features/profile/hooks/useUploadMedia";
import { MAX_IMAGES_PER_POST } from "../../constants/postOptions";
import type { PostType } from "../../types/post.types";

interface MediaUploadPanelProps {
  type: Extract<PostType, "IMAGE" | "VIDEO">;
  mediaUrls: string[];
  onChange: (urls: string[]) => void;
}

export default function MediaUploadPanel({ type, mediaUrls, onChange }: MediaUploadPanelProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const uploadMutation = useUploadMedia();

  const isImage = type === "IMAGE";
  const maxFiles = isImage ? MAX_IMAGES_PER_POST : 1;
  const accept = isImage ? "image/*" : "video/mp4,video/webm";

  const handleFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    const remainingSlots = maxFiles - mediaUrls.length;
    const toUpload = Array.from(files).slice(0, remainingSlots);

    if (toUpload.length === 0) {
      message.warning(`You can attach up to ${maxFiles} ${isImage ? "photos" : "video"}.`);
      return;
    }

    for (const file of toUpload) {
      try {
        const url = await uploadMutation.mutateAsync({
          file,
          folder: isImage ? "POST_IMAGE" : "POST_VIDEO",
        });
        onChange([...mediaUrls, url]);
      } catch {
        message.error(`Couldn't upload ${file.name}.`);
      }
    }

    if (inputRef.current) inputRef.current.value = "";
  };

  const removeAt = (index: number) => {
    onChange(mediaUrls.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-3">
      {mediaUrls.length > 0 && (
        <div className={`grid gap-2 ${isImage ? "grid-cols-2 sm:grid-cols-4" : "grid-cols-1"}`}>
          {mediaUrls.map((url, index) => (
            <div
              key={url}
              className="group relative overflow-hidden rounded-xl border border-gray-200 dark:border-neutral-700"
            >
              {isImage ? (
                <img src={url} alt="" className="h-32 w-full object-cover" />
              ) : (
                <video src={url} className="h-48 w-full object-cover" controls />
              )}
              <button
                type="button"
                onClick={() => removeAt(index)}
                aria-label="Remove"
                className="absolute right-1.5 top-1.5 flex h-6 w-6 items-center justify-center rounded-full bg-black/60 text-white opacity-0 transition group-hover:opacity-100"
              >
                <X size={13} />
              </button>
            </div>
          ))}
        </div>
      )}

      {mediaUrls.length < maxFiles && (
        <>
          <input
            ref={inputRef}
            type="file"
            accept={accept}
            multiple={isImage}
            className="hidden"
            onChange={(e) => handleFiles(e.target.files)}
          />
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={uploadMutation.isPending}
            className="flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-gray-300 py-6 text-sm text-gray-500 transition hover:border-racing-red-400 hover:text-racing-red-600 disabled:opacity-60 dark:border-neutral-700"
          >
            {uploadMutation.isPending ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <Plus size={16} />
            )}
            {isImage ? "Add photos" : "Add a video"}
          </button>
        </>
      )}
    </div>
  );
}
