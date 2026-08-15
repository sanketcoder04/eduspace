import type { ReactNode } from "react";
import { Typography, Tooltip } from "antd";
import { FileText, Star, Users, UserPlus } from "lucide-react";

const { Title, Text } = Typography;

interface StatItem {
  icon: ReactNode;
  label: string;
  value: number;
}

interface ActivityStatsCardProps {
  postsCount?: number;
  reviewsCount?: number;
  followersCount?: number;
  followingCount?: number;
}

// Posts, reviews, and follow are all future modules with no data model yet —
// shown honestly as a dashed "0 · coming soon" state rather than fabricated
// numbers, so the layout doesn't shift once they're wired up for real.
export default function ActivityStatsCard({
  postsCount = 0,
  reviewsCount = 0,
  followersCount = 0,
  followingCount = 0,
}: ActivityStatsCardProps) {
  const stats: StatItem[] = [
    { icon: <FileText size={16} />, label: "Posts", value: postsCount },
    { icon: <Users size={16} />, label: "Followers", value: followersCount },
    { icon: <UserPlus size={16} />, label: "Following", value: followingCount },
    { icon: <Star size={16} />, label: "Reviews", value: reviewsCount },
  ];

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
      <Title level={5} className="mb-4!">
        Analytics
      </Title>

      <div className="flex flex-col gap-2">
        {stats.map((stat) => (
          <Tooltip key={stat.label} title="Coming soon">
            <div className="flex p-2 items-baseline justify-between">
              <div className="flex items-center gap-2">
                <div className="flex text-racing-red-500">{stat.icon}</div>
                <Text type="secondary" className="text-xs">
                  {stat.label}
                </Text>
              </div>

              <div>
                <Text className="text-lg font-semibold">{stat.value}</Text>
              </div>
            </div>
          </Tooltip>
        ))}
      </div>
    </div>
  );
}

{
  /* 
              <Text type="secondary" className="text-xs">
                {stat.label}
                
              </Text> */
}
