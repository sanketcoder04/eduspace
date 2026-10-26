import { Link } from "react-router-dom";
import { Avatar, Button } from "antd";
import { UserCheck, User as UserIcon, UserPlus } from "lucide-react";
import { ROUTES } from "@/router/routes";
import type { UserSearchResult } from "../types/search.types";

interface UserSearchResultItemProps {
  user: UserSearchResult;
  index: number;
  isActive: boolean;
  isFollowPending: boolean;
  onHover: () => void;
  onSelect: () => void;
  onToggleFollow: (user: UserSearchResult) => void;
}

export default function UserSearchResultItem({
  user,
  index,
  isActive,
  isFollowPending,
  onHover,
  onSelect,
  onToggleFollow,
}: UserSearchResultItemProps) {
  return (
    <div
      data-index={index}
      onMouseEnter={onHover}
      className={`flex items-center gap-2 rounded-lg px-3 py-2 transition ${
        isActive
          ? "bg-racing-red-50 dark:bg-racing-red-950"
          : "hover:bg-gray-50 dark:hover:bg-neutral-800"
      }`}
    >
      <Link
        to={ROUTES.PROFILE_BY_ID(user.userId)}
        onClick={onSelect}
        className="flex min-w-0 flex-1 items-center gap-3"
      >
        <Avatar size={36} src={user.avatarUrl} icon={!user.avatarUrl && <UserIcon size={16} />} />
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium text-gray-900 dark:text-white">{user.name}</p>
          <p className="text-xs text-gray-400">{user.role === "TEACHER" ? "Teacher" : "Student"}</p>
        </div>
      </Link>

      <Button
        size="small"
        type={user.following ? "default" : "primary"}
        loading={isFollowPending}
        onClick={() => onToggleFollow(user)}
        className="shrink-0 rounded-lg font-semibold"
      >
        {user.following ? <UserCheck size={16} /> : <UserPlus size={16} />}
      </Button>
    </div>
  );
}
