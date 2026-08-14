import { Upload, message, Spin } from "antd";
import { Camera } from "lucide-react";
import { useUploadMedia } from "../../hooks/useUploadMedia";

interface CoverPhotoUploadProps {
  value?: string;
  onChange: (url: string) => void;
  isOwner: boolean;
  heightClassName?: string;
}

export default function CoverPhotoUpload({
  value,
  onChange,
  isOwner,
  heightClassName = "h-28 sm:h-40 md:h-48",
}: CoverPhotoUploadProps) {
  const uploadMutation = useUploadMedia();

  const handleBeforeUpload = (file: File) => {
    uploadMutation.mutate(
      { file, folder: "COVER" },
      {
        onSuccess: (url) => onChange(url),
        onError: () => message.error("Couldn't upload the cover photo. Please try again."),
      }
    );
    return false;
  };

  return (
    <div
      className={`group relative w-full overflow-hidden bg-linear-to-br from-racing-red-400 via-racing-red-500 to-racing-red-700 ${heightClassName}`}
      style={
        value
          ? {
              backgroundImage: `url(${value})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }
          : undefined
      }
    >
      {isOwner && (
        <Upload
          accept="image/*"
          showUploadList={false}
          beforeUpload={handleBeforeUpload}
          className="absolute inset-0 flex items-center justify-center"
        >
          <button
            type="button"
            aria-label="Change cover photo"
            className="flex h-full w-full items-center justify-center bg-black/0 transition cursor-pointer"
          >
            <span className="flex items-center gap-2 rounded-full bg-black/50 px-3 py-1.5 text-xs font-medium text-white opacity-0 transition group-hover:opacity-100">
              {uploadMutation.isPending ? <Spin size="small" /> : <Camera size={14} />}
              {uploadMutation.isPending ? "Uploading..." : "Change cover"}
            </span>
          </button>
        </Upload>
      )}
    </div>
  );
}
