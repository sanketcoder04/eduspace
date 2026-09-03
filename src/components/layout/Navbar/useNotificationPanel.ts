import { useNavigate } from "react-router-dom";
import { useUnreadNotificationCount } from "@/features/notification/hooks/useUnreadNotificationCount";
import { useNotifications } from "@/features/notification/hooks/useNotifications";
import { useMarkNotificationRead } from "@/features/notification/hooks/useMarkNotificationRead";
import { useMarkAllNotificationsRead } from "@/features/notification/hooks/useMarkAllNotificationsRead";
import { ROUTES } from "@/router/routes";
import type { NotificationResponse } from "@/features/notification/types/notification.types";

function resolveNotificationRoute(notification: NotificationResponse): string | null {
  switch (notification.referenceType) {
    case "APPLICATION":
      return ROUTES.APPLICATIONS;
    case "CONVERSATION":
      return notification.referenceId
        ? ROUTES.CONVERSATION_DETAIL(notification.referenceId)
        : ROUTES.CONVERSATIONS;
    case "OPPORTUNITY":
      return notification.referenceId ? ROUTES.OPPORTUNITY_DETAIL(notification.referenceId) : null;
    default:
      return null;
  }
}

/** Shared by both the desktop Dropdown panel and the mobile Drawer panel — one source of truth for data + selection behavior. */
export function useNotificationPanel(onAfterSelect?: () => void) {
  const navigate = useNavigate();

  const { data: unreadCount } = useUnreadNotificationCount();
  const { data: page, isLoading, refetch } = useNotifications({ page: 0, size: 8 });
  const markReadMutation = useMarkNotificationRead();
  const markAllReadMutation = useMarkAllNotificationsRead();

  const handleSelect = (notification: NotificationResponse) => {
    if (!notification.read) markReadMutation.mutate(notification.id);
    const route = resolveNotificationRoute(notification);
    if (route) navigate(route);
    onAfterSelect?.();
  };

  return {
    unreadCount: unreadCount ?? 0,
    page,
    isLoading,
    refetch,
    handleSelect,
    markAllRead: () => markAllReadMutation.mutate(),
    markAllReadPending: markAllReadMutation.isPending,
  };
}
