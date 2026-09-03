import { useEffect, useState } from "react";
import { Badge, Dropdown } from "antd";
import { Bell } from "lucide-react";
import { useNotificationPanel } from "./useNotificationPanel";
import NotificationList from "./NotificationList";

export default function NotificationBellDesktop() {
  const [open, setOpen] = useState(false);
  const panel = useNotificationPanel(() => setOpen(false));

  useEffect(() => {
    if (open) panel.refetch();
  }, [open]);

  return (
    <Dropdown
      open={open}
      onOpenChange={setOpen}
      trigger={["click"]}
      placement="bottomRight"
      popupRender={() => (
        <div className="w-80 rounded-xl border border-gray-200 bg-white shadow-lg dark:border-neutral-800 dark:bg-neutral-900">
          <NotificationList
            page={panel.page}
            isLoading={panel.isLoading}
            unreadCount={panel.unreadCount}
            onSelect={panel.handleSelect}
            onMarkAllRead={panel.markAllRead}
            markAllReadPending={panel.markAllReadPending}
          />
        </div>
      )}
    >
      <button
        type="button"
        aria-label="Notifications"
        className="relative flex h-10 w-10 items-center justify-center rounded-full text-gray-600 transition hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-neutral-800"
      >
        <Badge count={panel.unreadCount} size="small" offset={[-2, 2]}>
          <Bell size={20} />
        </Badge>
      </button>
    </Dropdown>
  );
}
