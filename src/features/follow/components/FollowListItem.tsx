import { Link } from "react-router-dom";
import { Avatar } from "antd";
import { User as UserIcon } from "lucide-react";
import { ROUTES } from "@/router/routes";
import type { FollowedUser } from "../types/follow.types";

interface FollowListItemProps {
  user: FollowedUser;
  onNavigate: () => void; // closes the drawer/dropdown before routing away
}

export default function FollowListItem({ user, onNavigate }: FollowListItemProps) {
  return (
    <Link
      to={ROUTES.PROFILE_BY_ID(user.userId)}
      onClick={onNavigate}
      className="flex items-center gap-3 rounded-xl px-3 py-2.5 transition hover:bg-gray-50 dark:hover:bg-neutral-800"
    >
      <Avatar size={40} src={user.avatarUrl} icon={!user.avatarUrl && <UserIcon size={18} />} />
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold text-gray-900 dark:text-white">{user.name}</p>
        <p className="text-xs text-gray-400">{user.role === "TEACHER" ? "Teacher" : "Student"}</p>
      </div>
    </Link>
  );
}
