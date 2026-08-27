import { useQuery } from "@tanstack/react-query";
import { getNotifications } from "../services/notification.service";
import type { PageableParams } from "@/types/api.types";

export function useNotifications(pageable?: PageableParams) {
  return useQuery({
    queryKey: ["notifications", "list", pageable?.page ?? 0],
    queryFn: () => getNotifications(pageable),
    placeholderData: (previousData) => previousData,
  });
}
