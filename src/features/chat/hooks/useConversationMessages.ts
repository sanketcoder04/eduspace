import { useQuery } from "@tanstack/react-query";
import { getMessages } from "../services/chat.service";
import type { PageableParams } from "@/types/api.types";

export function useConversationMessages(
  conversationId: string | undefined,
  pageable?: PageableParams
) {
  return useQuery({
    queryKey: ["conversations", "messages", conversationId, pageable?.page ?? 0],
    queryFn: () => getMessages(conversationId as string, pageable),
    enabled: !!conversationId,
    placeholderData: (previousData) => previousData,
  });
}
