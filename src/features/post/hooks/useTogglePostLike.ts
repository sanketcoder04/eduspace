import { useMutation, useQueryClient } from "@tanstack/react-query";
import { togglePostLike } from "../services/post.service";
import type { Page } from "@/types/api.types";
import type { PostResponse } from "../types/post.types";

function flipLike(post: PostResponse): PostResponse {
  return {
    ...post,
    likedByViewer: !post.likedByViewer,
    likesCount: post.likesCount + (post.likedByViewer ? -1 : 1),
  };
}

export function useTogglePostLike() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: togglePostLike,
    onMutate: async (postId: string) => {
      await queryClient.cancelQueries({ queryKey: ["posts"] });

      const previous = queryClient.getQueriesData<unknown>({ queryKey: ["posts"] });

      queryClient.setQueriesData<unknown>(
        { queryKey: ["posts"] },
        (cached: PostResponse | Page<PostResponse>) => {
          if (!cached || typeof cached !== "object") return cached;

          const asPage = cached as Page<PostResponse>;
          if (Array.isArray(asPage.content)) {
            return {
              ...asPage,
              content: asPage.content.map((post) => (post.id === postId ? flipLike(post) : post)),
            };
          }

          const asPost = cached as PostResponse;
          if (asPost.id === postId) return flipLike(asPost);

          return cached;
        }
      );

      return { previous };
    },
    onError: (_err, _postId, context) => {
      context?.previous.forEach(([key, data]) => {
        queryClient.setQueryData(key, data);
      });
    },
  });
}
