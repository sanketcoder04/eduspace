import { Empty, Spin } from "antd";
import { formatRelativeTime } from "@/utils/formatDate";
import type { NotificationResponse } from "@/features/notification/types/notification.types";

interface NotificationListProps {
  page: { content: NotificationResponse[] } | undefined;
  isLoading: boolean;
  unreadCount: number;
  onSelect: (notification: NotificationResponse) => void;
  onMarkAllRead: () => void;
  markAllReadPending: boolean;
}

export default function NotificationList({
  page,
  isLoading,
  unreadCount,
  onSelect,
  onMarkAllRead,
  markAllReadPending,
}: NotificationListProps) {
  return (
    <div>
      <div className="flex items-center justify-between border-b border-gray-100 px-4 py-3 dark:border-neutral-800">
        <span className="text-sm font-semibold text-gray-900 dark:text-white">Notifications</span>
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

      <div className="max-h-96 overflow-y-auto">
        {isLoading ? (
          <div className="flex justify-center py-8">
            <Spin size="small" />
          </div>
        ) : !page || page.content.length === 0 ? (
          <div className="py-8">
            <Empty description="No notifications yet" image={Empty.PRESENTED_IMAGE_SIMPLE} />
          </div>
        ) : (
          page.content.map((notification) => (
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
          ))
        )}
      </div>
    </div>
  );
}
