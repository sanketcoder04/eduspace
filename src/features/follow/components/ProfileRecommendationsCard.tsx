import { Avatar, Skeleton } from "antd";
import { Link } from "react-router-dom";
import { User as UserIcon } from "lucide-react";
import { useRecommendedProfiles } from "../hooks/useRecommendedProfiles";
import FollowButton from "./FollowButton";
import { ROUTES } from "@/router/routes";

export default function ProfileRecommendationsCard() {
  const { data, isLoading } = useRecommendedProfiles(5);

  if (!isLoading && (!data || data.length === 0)) return null;

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
      <h3 className="mb-4 text-sm font-semibold text-gray-900 dark:text-white">
        People you may know
      </h3>

      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} active avatar paragraph={{ rows: 1 }} />
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {data!.map((profile) => (
            <div key={profile.userId} className="flex items-center gap-3">
              <Link to={ROUTES.PROFILE_BY_ID(profile.userId)}>
                <Avatar
                  size={36}
                  src={profile.avatarUrl}
                  icon={!profile.avatarUrl && <UserIcon size={16} />}
                />
              </Link>
              <div className="min-w-0 flex-1">
                <Link
                  to={ROUTES.PROFILE_BY_ID(profile.userId)}
                  className="block truncate text-sm font-medium text-gray-900 hover:underline dark:text-white"
                >
                  {profile.name}
                </Link>
                <p className="text-xs text-gray-400">
                  {profile.role === "TEACHER" ? "Teacher" : "Student"}
                </p>
              </div>
              <FollowButton targetUserId={profile.userId} compact />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
