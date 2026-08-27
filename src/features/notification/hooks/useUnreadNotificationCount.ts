import { useQuery } from "@tanstack/react-query";
import { getUnreadNotificationCount } from "../services/notification.service";

export function useUnreadNotificationCount() {
  return useQuery({
    queryKey: ["notifications", "unread-count"],
    queryFn: getUnreadNotificationCount,
    // Cheap endpoint, polled from the nav bell — refetchInterval kept short
    // since it's a single integer, not a full list.
    refetchInterval: 1000 * 30,
    staleTime: 1000 * 15,
  });
}
