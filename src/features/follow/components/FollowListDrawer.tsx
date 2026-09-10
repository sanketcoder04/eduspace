import { Drawer, Empty, Skeleton, Pagination } from "antd";
import { useState } from "react";
import FollowListItem from "./FollowListItem";
import { useFollowersList } from "../hooks/useFollowersList";
import { useFollowingList } from "../hooks/useFollowingList";

interface FollowListDrawerProps {
  userId: string;
  mode: "followers" | "following";
  open: boolean;
  onClose: () => void;
}

export default function FollowListDrawer({ userId, mode, open, onClose }: FollowListDrawerProps) {
  const [page, setPage] = useState(0);

  const followersQuery = useFollowersList(userId, { page, size: 20 }, open && mode === "followers");
  const followingQuery = useFollowingList(userId, { page, size: 20 }, open && mode === "following");

  const { data, isLoading } = mode === "followers" ? followersQuery : followingQuery;

  return (
    <Drawer
      title={mode === "followers" ? "Followers" : "Following"}
      placement="right"
      width={380}
      open={open}
      onClose={onClose}
      styles={{ body: { padding: 12 } }}
    >
      {isLoading && !data ? (
        <div className="space-y-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} active avatar paragraph={{ rows: 1 }} />
          ))}
        </div>
      ) : !data || data.content.length === 0 ? (
        <Empty
          description={mode === "followers" ? "No followers yet" : "Not following anyone yet"}
          className="mt-12"
        />
      ) : (
        <div className="space-y-1">
          {data.content.map((user) => (
            <FollowListItem key={user.userId} user={user} onNavigate={onClose} />
          ))}

          {data.totalPages > 1 && (
            <div className="flex justify-center pt-4">
              <Pagination
                current={page + 1}
                total={data.totalElements}
                pageSize={data.size}
                onChange={(nextPage) => setPage(nextPage - 1)}
                showSizeChanger={false}
                size="small"
              />
            </div>
          )}
        </div>
      )}
    </Drawer>
  );
}
