import { useEffect, useState } from "react";
import { Badge, Drawer } from "antd";
import { Bell } from "lucide-react";
import { useNotificationPanel } from "./useNotificationPanel";
import NotificationList from "./NotificationList";

export default function NotificationBellMobile() {
  const [open, setOpen] = useState(false);
  const panel = useNotificationPanel(() => setOpen(false));

  const { refetch } = panel;

  useEffect(() => {
    if (open) void refetch();
  }, [open, refetch]);

  return (
    <>
      <button
        type="button"
        aria-label="Notifications"
        onClick={() => setOpen(true)}
        className="relative flex h-10 w-10 items-center justify-center rounded-full text-gray-600 transition hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-neutral-800"
      >
        <Badge count={panel.unreadCount} size="small" offset={[-2, 2]}>
          <Bell size={20} />
        </Badge>
      </button>

      <Drawer
        title="Notifications"
        placement="bottom"
        size="70vh"
        open={open}
        onClose={() => setOpen(false)}
        styles={{ body: { padding: 0 } }}
      >
        <NotificationList
          notifications={panel.notifications}
          isLoading={panel.isLoading}
          hasNextPage={panel.hasNextPage}
          isFetchingNextPage={panel.isFetchingNextPage}
          onLoadMore={panel.fetchNextPage}
          unreadCount={panel.unreadCount}
          onSelect={panel.handleSelect}
          onMarkAllRead={panel.markAllRead}
          markAllReadPending={panel.markAllReadPending}
          scrollClassName="max-h-[calc(70vh-110px)]"
        />
      </Drawer>
    </>
  );
}
