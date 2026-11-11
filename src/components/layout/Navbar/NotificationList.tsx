import { useEffect, useRef } from "react";
import { Empty, Spin } from "antd";
import { formatRelativeTime } from "@/utils/formatDate";
import type { NotificationResponse } from "@/features/notification/types/notification.types";

interface NotificationListProps {
  notifications: NotificationResponse[];
  isLoading: boolean;
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
  onLoadMore: () => void;
  unreadCount: number;
  onSelect: (notification: NotificationResponse) => void;
  onMarkAllRead: () => void;
  markAllReadPending: boolean;
  scrollClassName?: string;
}

export default function NotificationList({
  notifications,
  isLoading,
  hasNextPage,
  isFetchingNextPage,
  onLoadMore,
  unreadCount,
  onSelect,
  onMarkAllRead,
  markAllReadPending,
  scrollClassName = "max-h-96",
}: NotificationListProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const sentinelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = scrollRef.current;
    const sentinel = sentinelRef.current;
    if (!root || !sentinel || !hasNextPage || isFetchingNextPage) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) onLoadMore();
      },
      { root, rootMargin: "0px 0px 120px 0px" }
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [hasNextPage, isFetchingNextPage, onLoadMore, notifications.length]);

  return (
    <div>
      <div className="flex items-center justify-between lg:border-gray-100 px-4 py-3 dark:border-neutral-800">
        <span className="text-sm font-semibold text-gray-900 dark:text-white hidden lg:inline">
          Notifications
        </span>
        {unreadCount > 0 && (
          <button
            type="button"
            disabled={markAllReadPending}
            onClick={onMarkAllRead}
            className="text-xs font-medium text-racing-red-600 hover:underline disabled:opacity-50"
          >
            Mark all read
          </button>
        )}
      </div>

      <div
        ref={scrollRef}
        className={`${scrollClassName} overflow-y-auto scrollbar-none [&::-webkit-scrollbar]:hidden`}
      >
        {isLoading ? (
          <div className="flex justify-center py-8">
            <Spin size="small" />
          </div>
        ) : notifications.length === 0 ? (
          <div className="py-8">
            <Empty description="No notifications yet" image={Empty.PRESENTED_IMAGE_SIMPLE} />
          </div>
        ) : (
          <>
            {notifications.map((notification) => (
              <button
                key={notification.id}
                type="button"
                onClick={() => onSelect(notification)}
                className={`
                  flex w-full flex-col gap-0.5 border-b border-gray-50 px-4 py-3 text-left transition
                  hover:bg-gray-50 dark:border-neutral-800 dark:hover:bg-neutral-800
                  ${!notification.read ? "bg-racing-red-50/40 dark:bg-racing-red-950/20" : ""}
                `}
              >
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  {notification.title}
                </span>
                <span className="line-clamp-2 text-xs text-gray-500">{notification.body}</span>
                <span className="mt-0.5 text-[11px] text-gray-400">
                  {formatRelativeTime(notification.createdAt)}
                </span>
              </button>
            ))}

            <div ref={sentinelRef} className="h-1" />

            {isFetchingNextPage && (
              <div className="flex justify-center py-3">
                <Spin size="small" />
              </div>
            )}
            {!hasNextPage && (
              <p className="py-3 text-center text-[11px] text-gray-400">You're all caught up</p>
            )}
          </>
        )}
      </div>
    </div>
  );
}
