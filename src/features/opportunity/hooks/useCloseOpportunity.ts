import { useMutation, useQueryClient } from "@tanstack/react-query";
import { closeOpportunity } from "../services/opportunity.service";

export function useCloseOpportunity() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: closeOpportunity,
    onSuccess: (updated) => {
      queryClient.setQueryData(["opportunities", "detail", updated.id], updated);
      queryClient.invalidateQueries({ queryKey: ["opportunities", "search"] });
    },
  });
}
