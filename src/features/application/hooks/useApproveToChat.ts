import { useMutation, useQueryClient } from "@tanstack/react-query";
import { approveApplicationToChat } from "../services/application.service";

export function useApproveToChat() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: approveApplicationToChat,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["applications", "received"] });
      queryClient.invalidateQueries({ queryKey: ["conversations"] });
    },
  });
}
