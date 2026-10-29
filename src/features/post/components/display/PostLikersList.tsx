import { useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Avatar, Button, Input, Skeleton, Spin } from "antd";
import { Search, User as UserIcon } from "lucide-react";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { useDebouncedValue } from "@/utils/useDebouncedValue";
import { useLoadMoreSentinel } from "@/utils/useLoadMoreSentinel";
import { usePostLikers } from "../../hooks/usePostLikers";
import { ROUTES } from "@/router/routes";
import type { PostLiker } from "../../types/post.types";

interface PostLikersListProps {
  postId: string;
  enabled: boolean;
  scrollClassName: string;
  onNavigate: () => void;
}

export default function PostLikersList({
  postId,
  enabled,
  scrollClassName,
  onNavigate,
}: PostLikersListProps) {
  const { auth } = useAuth();
  const scrollRef = useRef<HTMLDivElement>(null);

  const [query, setQuery] = useState("");
  const debouncedQuery = useDebouncedValue(query, 300);
  const searchTerm = debouncedQuery.trim();

  const {
    data,
    isPending,
    isError,
    isFetching,
    isPlaceholderData,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
    refetch,
  } = usePostLikers(postId, debouncedQuery, enabled);

  const likers = useMemo(() => {
    const unique = new Map<string, PostLiker>();
    data?.pages.forEach((page) =>
      page.content.forEach((liker) => {
        if (!unique.has(liker.userId)) unique.set(liker.userId, liker);
      })
    );
    return [...unique.values()];
  }, [data]);

  const isSettling = query.trim() !== searchTerm || isPlaceholderData;

  const setSentinel = useLoadMoreSentinel({
    rootRef: scrollRef,
    enabled: enabled && !!hasNextPage && !isFetchingNextPage && !isError && !isPlaceholderData,
    onLoadMore: () => {
      void fetchNextPage();
    },
  });

  const showEmpty = likers.length === 0 && !isError && !isSettling && !isFetching;

  return (
    <div className="flex flex-col">
      <div className="shrink-0 border-b border-gray-100 p-2 dark:border-neutral-800">
        <Input
          allowClear
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          prefix={<Search size={14} className="text-gray-400" />}
          placeholder="Search people who liked"
          aria-label="Search people who liked this post"
          maxLength={100}
        />
      </div>

      <div
        ref={scrollRef}
        className={`overflow-y-auto transition-opacity ${isSettling ? "opacity-60" : ""} ${scrollClassName}`}
      >
        {isPending && !isError ? (
          <div className="space-y-1 p-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} active avatar paragraph={false} title={{ width: "55%" }} />
            ))}
          </div>
        ) : showEmpty ? (
          <p className="px-4 py-8 text-center text-sm text-gray-400">
            {searchTerm ? `No one found for "${searchTerm}"` : "No likes yet"}
          </p>
        ) : (
          <div className="p-1">
            {likers.map((liker) => (
              <Link
                key={liker.userId}
                to={ROUTES.PROFILE_BY_ID(liker.userId)}
                onClick={onNavigate}
                className="flex items-center gap-3 rounded-lg px-3 py-2 transition hover:bg-gray-50 dark:hover:bg-neutral-800"
              >
                <Avatar
                  size={36}
                  src={liker.avatarUrl}
                  icon={!liker.avatarUrl && <UserIcon size={16} />}
                />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-gray-900 dark:text-white">
                    {liker.name}
                    {liker.userId === auth.user?.id && (
                      <span className="ml-1.5 text-xs font-normal text-gray-400">(You)</span>
                    )}
                  </p>
                  <p className="text-xs text-gray-400">
                    {liker.role === "TEACHER" ? "Teacher" : "Student"}
                  </p>
                </div>
              </Link>
            ))}

            {hasNextPage && !isError && (
              <div ref={setSentinel} className="flex h-10 items-center justify-center">
                {isFetchingNextPage && <Spin size="small" />}
              </div>
            )}
          </div>
        )}

        {isError && (
          <div className="flex flex-col items-center gap-2 px-4 py-6 text-sm text-gray-400">
            <span>Couldn't load likes.</span>
            <Button
              size="small"
              onClick={() => void (data ? fetchNextPage() : refetch())}
              className="rounded-lg"
            >
              Try again
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
