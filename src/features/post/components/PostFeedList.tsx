import { useState } from "react";
import { Pagination, Empty, Skeleton } from "antd";
import PostCard from "./display/PostCard";
import { useFeed } from "../hooks/useFeed";

export default function PostFeedList() {
  const [page, setPage] = useState(0);
  const { data, isLoading } = useFeed({ page, size: 10 });

  if (isLoading && !data) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="rounded-2xl border border-gray-200 p-4 dark:border-neutral-800">
            <Skeleton active avatar paragraph={{ rows: 3 }} />
          </div>
        ))}
      </div>
    );
  }

  if (!data || data.content.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-gray-200 py-16 dark:border-neutral-800">
        <Empty description="No posts yet — follow people to see their posts here." />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {data.content.map((post) => (
        <div key={post.id} className="flex flex-col gap-1">
          <PostCard post={post} />
        </div>
      ))}

      {data.totalPages > 1 && (
        <div className="flex justify-center pt-2">
          <Pagination
            current={page + 1}
            total={data.totalElements}
            pageSize={data.size}
            onChange={(nextPage) => setPage(nextPage - 1)}
            showSizeChanger={false}
          />
        </div>
      )}
    </div>
  );
}
