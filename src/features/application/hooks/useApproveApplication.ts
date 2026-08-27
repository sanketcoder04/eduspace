import { useMutation, useQueryClient } from "@tanstack/react-query";
import { approveApplication } from "../services/application.service";

export function useApproveApplication() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: approveApplication,
    onSuccess: () => {
      // Approval also opens a Conversation server-side, so the chat list is
      // stale the moment this succeeds too.
      queryClient.invalidateQueries({ queryKey: ["applications", "received"] });
      queryClient.invalidateQueries({ queryKey: ["conversations"] });
    },
  });
}
