import { useMutation, useQueryClient } from "@tanstack/react-query";
import { finalizeApplication } from "../services/application.service";

export function useFinalizeApplication() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: finalizeApplication,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["applications", "received"] });
      queryClient.invalidateQueries({ queryKey: ["opportunities"] });
    },
  });
}
