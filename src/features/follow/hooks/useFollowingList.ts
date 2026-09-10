import { useQuery } from "@tanstack/react-query";
import { getFollowing } from "../services/follow.service";
import type { PageableParams } from "@/types/api.types";

export function useFollowingList(
  userId: string | undefined,
  pageable?: PageableParams,
  enabled = true
) {
  return useQuery({
    queryKey: ["follows", "following", userId, pageable?.page ?? 0],
    queryFn: () => getFollowing(userId as string, pageable),
    enabled: !!userId && enabled,
    staleTime: 0,
    refetchOnMount: "always",
  });
}
