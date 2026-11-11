import { useInfiniteQuery } from "@tanstack/react-query";
import { getNotifications } from "../services/notification.service";

const PAGE_SIZE = 15;

export function useInfiniteNotifications() {
  return useInfiniteQuery({
    queryKey: ["notifications", "list"],
    queryFn: ({ pageParam }) => getNotifications({ page: pageParam, size: PAGE_SIZE }),
    initialPageParam: 0,
    getNextPageParam: (lastPage) => (lastPage.last ? undefined : lastPage.number + 1),
  });
}
