import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deletePost } from "../services/post.service";

export function useDeletePost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deletePost,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
  });
}
