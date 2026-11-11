import { useState } from "react";
import type { ReactNode } from "react";
import { Typography } from "antd";
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
      <Title level={5} className="mb-4! hidden lg:block">
        Analytics
      </Title>

      <div className="flex justify-between gap-2 lg:flex-col">
        {stats.map((stat) => {
          const row = (
            <div className="flex lg:items-center gap-2 ">
              <div className="text-racing-red-500 hidden lg:flex">{stat.icon}</div>
              <Text type="secondary" className="text-[12px]! lg:text-xs">
                {stat.label}
              </Text>
            </div>
          );

          const content = (
            <div className="flex flex-col-reverse justify-center items-center py-2 lg:flex-row lg:items-baseline lg:justify-between">
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
                    className="text-lg lg:text-sm font-semibold text-racing-red-500 lg:text-black hover:text-racing-red-600 cursor-pointer"
                  >
                    {stat.value}
                  </button>
                ) : (
                  <Text className="text-lg! lg:text-sm! font-semibold text-racing-red-500! lg:text-black!">
                    {stat.value}
                  </Text>
                )}
              </div>
            </div>
          );

          return <div key={stat.key}>{content}</div>;
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
