import { useRef } from "react";
import { message } from "antd";
import { FileText, X, Loader2, Upload } from "lucide-react";
import { useUploadMedia } from "@/features/profile/hooks/useUploadMedia";

interface DocumentUploadPanelProps {
  documentUrl?: string;
  documentFileName?: string;
  onChange: (url: string | undefined, fileName: string | undefined) => void;
}

export default function DocumentUploadPanel({
  documentUrl,
  documentFileName,
  onChange,
}: DocumentUploadPanelProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const uploadMutation = useUploadMedia();

  const handleFile = async (file: File | undefined) => {
    if (!file) return;
    try {
      const url = await uploadMutation.mutateAsync({ file, folder: "POST_DOCUMENT" });
      onChange(url, file.name);
    } catch {
      message.error(`Couldn't upload ${file.name}.`);
    } finally {
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  if (documentUrl) {
    return (
      <div className="flex items-center gap-3 rounded-xl border border-gray-200 p-3 dark:border-neutral-700">
        <FileText size={20} className="shrink-0 text-racing-red-500" />
        <span className="min-w-0 flex-1 truncate text-sm text-gray-700 dark:text-gray-200">
          {documentFileName}
        </span>
        <button
          type="button"
          onClick={() => onChange(undefined, undefined)}
          aria-label="Remove document"
        >
          <X size={16} className="text-gray-400 hover:text-racing-red-600" />
        </button>
      </div>
    );
  }

  return (
    <>
      <input
        ref={inputRef}
        type="file"
        accept=".pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx"
        className="hidden"
        onChange={(e) => handleFile(e.target.files?.[0])}
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
          <Upload size={16} />
        )}
        Upload a document
      </button>
    </>
  );
}
