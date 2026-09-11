import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toggleCommentLike } from "../services/comment.service";

export function useToggleCommentLike() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: toggleCommentLike,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comments"] });
    },
  });
}
