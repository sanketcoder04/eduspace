import { useQuery } from "@tanstack/react-query";
import { getPostsByUser } from "../services/post.service";
import type { PageableParams } from "@/types/api.types";

export function useUserPosts(userId: string | undefined, pageable?: PageableParams) {
  return useQuery({
    queryKey: ["posts", "user", userId, pageable?.page ?? 0],
    queryFn: () => getPostsByUser(userId as string, pageable),
    enabled: !!userId,
    placeholderData: (previousData) => previousData,
  });
}
