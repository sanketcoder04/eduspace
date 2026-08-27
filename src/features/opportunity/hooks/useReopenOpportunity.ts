import { useMutation, useQueryClient } from "@tanstack/react-query";
import { reopenOpportunity } from "../services/opportunity.service";

export function useReopenOpportunity() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: reopenOpportunity,
    onSuccess: (updated) => {
      queryClient.setQueryData(["opportunities", "detail", updated.id], updated);
      queryClient.invalidateQueries({ queryKey: ["opportunities", "search"] });
    },
  });
}
