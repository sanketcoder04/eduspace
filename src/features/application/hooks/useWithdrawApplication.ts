import { useMutation, useQueryClient } from "@tanstack/react-query";
import { withdrawApplication } from "../services/application.service";

export function useWithdrawApplication() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: withdrawApplication,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["applications", "sent"] });
      queryClient.invalidateQueries({ queryKey: ["conversations"] });
    },
  });
}
