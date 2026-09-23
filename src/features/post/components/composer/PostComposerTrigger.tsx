import { useState } from "react";
import { Avatar } from "antd";
import { User as UserIcon } from "lucide-react";
import { useMyProfile } from "@/features/profile/hooks/useMyProfile";
import PostComposerModal from "./PostComposerModal";

export default function PostComposerTrigger() {
  const [open, setOpen] = useState(false);
  const { profile } = useMyProfile();
  const avatarUrl = profile && "avatarUrl" in profile ? profile.avatarUrl : undefined;

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="flex w-full items-center gap-3 rounded-2xl border border-gray-200 bg-white p-4 text-left shadow-sm transition hover:border-racing-red-300 dark:border-neutral-800 dark:bg-neutral-900"
      >
        <Avatar size={40} src={avatarUrl} icon={!avatarUrl && <UserIcon size={18} />} />
        <span className="flex-1 rounded-full border border-gray-200 px-4 py-2 text-sm text-gray-400 dark:border-neutral-700">
          Share something with your network...
        </span>
      </button>

      <PostComposerModal open={open} onClose={() => setOpen(false)} />
    </>
  );
}
