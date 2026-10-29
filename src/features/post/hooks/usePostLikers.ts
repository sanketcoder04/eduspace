import { useInfiniteQuery } from "@tanstack/react-query";
import { getPostLikers } from "../services/post.service";

export function usePostLikers(postId: string, query: string, enabled: boolean) {
  const trimmed = query.trim();

  return useInfiniteQuery({
    queryKey: ["posts", "likers", postId, trimmed.toLowerCase()],
    queryFn: ({ pageParam, signal }) => getPostLikers(postId, trimmed, pageParam, signal),
    initialPageParam: 0,
    getNextPageParam: (lastPage) => (lastPage.hasNext ? lastPage.page + 1 : undefined),
    placeholderData: (previousData) => previousData,
    enabled,
  });
}
