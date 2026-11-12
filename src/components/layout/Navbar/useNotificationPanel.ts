import { useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useUnreadNotificationCount } from "@/features/notification/hooks/useUnreadNotificationCount";
import { useInfiniteNotifications } from "@/features/notification/hooks/useInfiniteNotifications";
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
    case "PROFILE":
    case "FOLLOW":
      return notification.referenceId ? ROUTES.PROFILE_BY_ID(notification.referenceId) : null;
    case "POST":
      return notification.referenceId ? ROUTES.POST_DETAIL(notification.referenceId) : null;
    case "COMMENT":
      return notification.referenceId && notification.type != "POST_LIKED"
        ? ROUTES.POST_DETAIL(notification.referenceId)
        : null;
    default:
      return null;
  }
}

export function useNotificationPanel(onAfterSelect?: () => void) {
  const navigate = useNavigate();

  const { data: unreadCount } = useUnreadNotificationCount();

  const query = useInfiniteNotifications();
  const { fetchNextPage, refetch } = query;

  const markReadMutation = useMarkNotificationRead();
  const markAllReadMutation = useMarkAllNotificationsRead();

  // Flatten pages and de-dupe by id: offset pagination can repeat an item
  // if a new notification arrives between page fetches.
  const notifications = useMemo(() => {
    const seen = new Set<string>();
    return (query.data?.pages.flatMap((p) => p.content) ?? []).filter((n) => {
      if (seen.has(n.id)) return false;
      seen.add(n.id);
      return true;
    });
  }, [query.data]);

  const loadMore = useCallback(() => {
    void fetchNextPage({ cancelRefetch: false });
  }, [fetchNextPage]);

  const handleSelect = (notification: NotificationResponse) => {
    if (!notification.read) markReadMutation.mutate(notification.id);
    const route = resolveNotificationRoute(notification);
    if (route) navigate(route);
    onAfterSelect?.();
  };

  return {
    unreadCount: unreadCount ?? 0,
    notifications,
    isLoading: query.isLoading,
    hasNextPage: !!query.hasNextPage,
    isFetchingNextPage: query.isFetchingNextPage,
    fetchNextPage: loadMore,
    refetch,
    handleSelect,
    markAllRead: () => markAllReadMutation.mutate(),
    markAllReadPending: markAllReadMutation.isPending,
  };
}
