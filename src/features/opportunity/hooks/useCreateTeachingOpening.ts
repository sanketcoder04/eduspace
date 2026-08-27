import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createTeachingOpening } from "../services/opportunity.service";

export function useCreateTeachingOpening() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createTeachingOpening,
    onSuccess: () => {
      // A fresh posting should show up next time the feed/my-posts list is viewed.
      queryClient.invalidateQueries({ queryKey: ["opportunities"] });
    },
  });
}
