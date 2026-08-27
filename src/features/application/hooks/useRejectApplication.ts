import { useMutation, useQueryClient } from "@tanstack/react-query";
import { rejectApplication } from "../services/application.service";
import type { RejectApplicationRequest } from "../types/application.types";

export function useRejectApplication() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload?: RejectApplicationRequest }) =>
      rejectApplication(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["applications", "received"] });
      queryClient.invalidateQueries({ queryKey: ["conversations"] });
    },
  });
}
