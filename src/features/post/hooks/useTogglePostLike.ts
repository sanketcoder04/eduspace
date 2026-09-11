import { useMutation, useQueryClient } from "@tanstack/react-query";
import { togglePostLike } from "../services/post.service";
import type { Page } from "@/types/api.types";
import type { PostResponse } from "../types/post.types";

/**
 * Optimistic update — flips likedByViewer/likesCount immediately in every
 * cached page (feed + user-posts) that currently contains this post, rather
 * than waiting for a refetch. Reverts on failure via onError's rollback.
 */
export function useTogglePostLike() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: togglePostLike,
    onMutate: async (postId: string) => {
      await queryClient.cancelQueries({ queryKey: ["posts"] });

      const previous = queryClient.getQueriesData<Page<PostResponse>>({ queryKey: ["posts"] });

      const patch = (page: Page<PostResponse> | undefined) => {
        if (!page) return page;
        return {
          ...page,
          content: page.content.map((post) =>
            post.id === postId
              ? {
                  ...post,
                  likedByViewer: !post.likedByViewer,
                  likesCount: post.likesCount + (post.likedByViewer ? -1 : 1),
                }
              : post
          ),
        };
      };
      queryClient.setQueriesData<Page<PostResponse>>({ queryKey: ["posts"] }, patch);

      return { previous };
    },
    onError: (_err, _postId, context) => {
      context?.previous.forEach(([key, data]) => {
        queryClient.setQueryData(key, data);
      });
    },
  });
}
