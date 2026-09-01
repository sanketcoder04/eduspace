import { useQuery } from "@tanstack/react-query";
import { getMyConversations } from "../services/chat.service";
import type { PageableParams } from "@/types/api.types";

export function useConversations(pageable?: PageableParams) {
  return useQuery({
    queryKey: ["conversations", "list", pageable?.page ?? 0],
    queryFn: () => getMyConversations(pageable),
    placeholderData: (previousData) => previousData,
  });
}
