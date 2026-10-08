import { useState } from "react";
import { Segmented, Skeleton, Empty, Typography } from "antd";
import { useUserPosts } from "@/features/post/hooks/useUserPosts";
import { useUserOpportunities } from "@/features/opportunity/hooks/useUserOpportunities";
import PostsCarousel from "@/features/post/components/display/PostsCarousel";
import OpportunitiesCarousel from "@/features/opportunity/components/OpportunitiesCarousel";

type ActivityTab = "POSTS" | "OPPORTUNITIES";

const { Title } = Typography;

interface ActivitySectionProps {
  userId: string | undefined;
  postedOpportunitiesEnabled: boolean;
}

export default function ActivitySection({
  userId,
  postedOpportunitiesEnabled,
}: ActivitySectionProps) {
  const [tab, setTab] = useState<ActivityTab>("POSTS");

  const { data: postsPage, isLoading: postsLoading } = useUserPosts(userId, { page: 0, size: 10 });
  const { data: opportunitiesPage, isLoading: opportunitiesLoading } = useUserOpportunities(
    userId,
    {
      page: 0,
      size: 10,
    }
  );

  const isEmpty =
    tab === "POSTS"
      ? !postsLoading && (!postsPage || postsPage.content.length === 0)
      : !opportunitiesLoading && (!opportunitiesPage || opportunitiesPage.content.length === 0);

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
      <div className="mb-4 flex items-center justify-between">
        <Title level={5} className="mb-2!">
          Activities
        </Title>

        {postedOpportunitiesEnabled && (
          <Segmented
            value={tab}
            onChange={(v) => setTab(v as ActivityTab)}
            options={[
              { label: "Posts", value: "POSTS" },
              { label: "Opportunities", value: "OPPORTUNITIES" },
            ]}
            size="small"
          />
        )}
      </div>

      {(tab === "POSTS" ? postsLoading : opportunitiesLoading) ? (
        <div className="flex gap-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton.Image key={i} active className="h-40! w-56! rounded-xl!" />
          ))}
        </div>
      ) : isEmpty ? (
        <Empty
          description={tab === "POSTS" ? "No posts yet" : "No opportunities posted yet"}
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          className="py-6"
        />
      ) : tab === "POSTS" ? (
        <PostsCarousel posts={postsPage!.content} />
      ) : (
        <OpportunitiesCarousel opportunities={opportunitiesPage!.content} />
      )}
    </div>
  );
}
