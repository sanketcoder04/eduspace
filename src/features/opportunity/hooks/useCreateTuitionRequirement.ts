import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createTuitionRequirement } from "../services/opportunity.service";

export function useCreateTuitionRequirement() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createTuitionRequirement,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["opportunities"] });
    },
  });
}
