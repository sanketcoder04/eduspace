import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createPost } from "../services/post.service";

export function useCreatePost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createPost,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts", "feed"] });
      queryClient.invalidateQueries({ queryKey: ["posts", "user"] });
    },
  });
}
