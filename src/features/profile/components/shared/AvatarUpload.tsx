import { Avatar, Upload, message, Spin } from "antd";
import { Camera, User as UserIcon } from "lucide-react";
import { useUploadMedia } from "../../hooks/useUploadMedia";
import type { MediaFolder } from "../../types/profile.types";

interface AvatarUploadProps {
  value?: string;
  onChange: (url: string) => void;
  folder?: Extract<MediaFolder, "AVATAR" | "SELFIE">;
  size?: number;
}

export default function AvatarUpload({
  value,
  onChange,
  folder = "AVATAR",
  size = 96,
}: AvatarUploadProps) {
  const uploadMutation = useUploadMedia();

  const handleBeforeUpload = (file: File) => {
    uploadMutation.mutate(
      { file, folder },
      {
        onSuccess: (url) => onChange(url),
        onError: () => message.error("Couldn't upload the photo. Please try again."),
      }
    );
    return false; // prevent AntD's default auto-upload — we handle it ourselves
  };

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative">
        <Avatar
          size={size}
          src={value}
          icon={!value && <UserIcon size={size / 2} />}
          className="border-4 border-white shadow-md dark:border-neutral-800"
        />
        <Upload
          accept="image/*"
          showUploadList={false}
          beforeUpload={handleBeforeUpload}
          className="absolute -bottom-1 -right-1"
        >
          <button
            type="button"
            aria-label="Upload photo"
            className="flex h-9 w-9 items-center justify-center rounded-full bg-racing-red-500 text-white shadow-md transition hover:bg-racing-red-600 cursor-pointer"
          >
            {uploadMutation.isPending ? <Spin size="small" /> : <Camera size={16} />}
          </button>
        </Upload>
      </div>
    </div>
  );
}
