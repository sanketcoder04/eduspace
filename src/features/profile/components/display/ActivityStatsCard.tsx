import { useState } from "react";
import type { ReactNode } from "react";
import { Typography, Tooltip } from "antd";
import { FileText, Star, Users, UserPlus } from "lucide-react";
import FollowListDrawer from "@/features/follow/components/FollowListDrawer";

const { Title, Text } = Typography;

interface StatItem {
  key: string;
  icon: ReactNode;
  label: string;
  value: number;
  clickable: boolean;
}

interface ActivityStatsCardProps {
  postsCount?: number;
  reviewsCount?: number;
  followersCount?: number;
  followingCount?: number;
  interactive?: boolean;
  userId?: string;
}

export default function ActivityStatsCard({
  postsCount = 0,
  reviewsCount = 0,
  followersCount = 0,
  followingCount = 0,
  interactive = false,
  userId,
}: ActivityStatsCardProps) {
  const [openDrawer, setOpenDrawer] = useState<"followers" | "following" | null>(null);

  const stats: StatItem[] = [
    {
      key: "posts",
      icon: <FileText size={16} />,
      label: "Posts",
      value: postsCount,
      clickable: false,
    },
    {
      key: "followers",
      icon: <Users size={16} />,
      label: "Followers",
      value: followersCount,
      clickable: interactive,
    },
    {
      key: "following",
      icon: <UserPlus size={16} />,
      label: "Following",
      value: followingCount,
      clickable: interactive,
    },
    {
      key: "reviews",
      icon: <Star size={16} />,
      label: "Reviews",
      value: reviewsCount,
      clickable: false,
    },
  ];

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
      <Title level={5} className="mb-4!">
        Analytics
      </Title>

      <div className="flex flex-col gap-2">
        {stats.map((stat) => {
          const row = (
            <div className="flex items-center gap-2">
              <div className="flex text-racing-red-500">{stat.icon}</div>
              <Text type="secondary" className="text-xs">
                {stat.label}
              </Text>
            </div>
          );

          const content = (
            <div className="flex py-2 items-baseline justify-between">
              {stat.clickable ? (
                <button
                  type="button"
                  onClick={() => setOpenDrawer(stat.key as "followers" | "following")}
                  className="flex items-center gap-2 hover:text-racing-red-600"
                >
                  {row}
                </button>
              ) : (
                row
              )}

              <div>
                {stat.clickable ? (
                  <button
                    type="button"
                    onClick={() => setOpenDrawer(stat.key as "followers" | "following")}
                    className="text-sm font-semibold hover:text-racing-red-600 cursor-pointer"
                  >
                    {stat.value}
                  </button>
                ) : (
                  <Text className="text-sm font-semibold">{stat.value}</Text>
                )}
              </div>
            </div>
          );

          // Posts/Reviews aren't wired up yet (still 0 everywhere) — keep the
          // existing "Coming soon" tooltip for those two specifically.
          return stat.clickable ? (
            <div key={stat.key}>{content}</div>
          ) : (
            <Tooltip key={stat.key} title="Coming soon">
              {content}
            </Tooltip>
          );
        })}
      </div>

      {interactive && userId && (
        <FollowListDrawer
          userId={userId}
          mode={openDrawer ?? "followers"}
          open={openDrawer !== null}
          onClose={() => setOpenDrawer(null)}
        />
      )}
    </div>
  );
}
