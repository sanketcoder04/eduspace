import { useQuery } from "@tanstack/react-query";
import { getPostsCountByUser } from "../services/post.service";

export function useUserPostsCount(userId: string | undefined) {
  return useQuery({
    queryKey: ["posts", "count", userId],
    queryFn: () => getPostsCountByUser(userId as string),
    enabled: !!userId,
    staleTime: 1000 * 30,
  });
}
