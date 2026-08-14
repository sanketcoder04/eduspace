import type { ChangeEvent } from "react";
import { Button, message } from "antd";
import { Paperclip, X, Loader2 } from "lucide-react";
import { useUploadMedia } from "../../hooks/useUploadMedia";
import type { MediaFolder } from "../../types/profile.types";

interface FileUploadProps {
  label: string;
  value?: string;
  onChange: (url: string | undefined) => void;
  folder: Extract<MediaFolder, "RESUME" | "CERTIFICATE">;
  accept?: string;
}

export default function FileUpload({
  label,
  value,
  onChange,
  folder,
  accept = ".pdf,image/*",
}: FileUploadProps) {
  const uploadMutation = useUploadMedia();

  const handleSelect = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    uploadMutation.mutate(
      { file, folder },
      {
        onSuccess: (url) => onChange(url),
        onError: () => message.error(`Couldn't upload ${label.toLowerCase()}. Please try again.`),
      }
    );
    e.target.value = "";
  };

  return (
    <div className="flex items-center gap-2">
      {value ? (
        <div className="flex items-center gap-2 rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-sm dark:border-neutral-700 dark:bg-neutral-800">
          <Paperclip size={14} className="text-racing-red-500" />
          <a
            href={value}
            target="_blank"
            rel="noreferrer"
            className="max-w-40 truncate text-racing-red-600 hover:underline"
          >
            {label}
          </a>
          <button type="button" onClick={() => onChange(undefined)} aria-label={`Remove ${label}`}>
            <X size={14} className="text-gray-400 hover:text-gray-600" />
          </button>
        </div>
      ) : (
        <label>
          <input type="file" accept={accept} className="hidden" onChange={handleSelect} />
          <Button
            icon={
              uploadMutation.isPending ? (
                <Loader2 size={14} className="animate-spin" />
              ) : (
                <Paperclip size={14} />
              )
            }
            className="rounded-xl"
          >
            {uploadMutation.isPending ? "Uploading..." : `Upload ${label}`}
          </Button>
        </label>
      )}
    </div>
  );
}
