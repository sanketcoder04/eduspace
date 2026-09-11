import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createComment } from "../services/comment.service";
import type { CreateCommentRequest } from "../types/post.types";

export function useCreateComment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ postId, payload }: { postId: string; payload: CreateCommentRequest }) =>
      createComment(postId, payload),
    onSuccess: (comment) => {
      if (comment.parentCommentId) {
        queryClient.invalidateQueries({
          queryKey: ["comments", "replies", comment.parentCommentId],
        });
      } else {
        queryClient.invalidateQueries({ queryKey: ["comments", "top-level", comment.postId] });
      }
      queryClient.invalidateQueries({ queryKey: ["posts"] }); // commentsCount changed
    },
  });
}
