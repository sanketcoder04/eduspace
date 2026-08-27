import { useMutation, useQueryClient } from "@tanstack/react-query";
import { applyToOpportunity } from "../services/application.service";

export function useApplyToOpportunity() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: applyToOpportunity,
    onSuccess: (application) => {
      // "Sent" tab should show the new application immediately, and the
      // opportunity's applicationsCount changed server-side too.
      queryClient.invalidateQueries({ queryKey: ["applications", "sent"] });
      queryClient.invalidateQueries({
        queryKey: ["opportunities", "detail", application.opportunityId],
      });
    },
  });
}
