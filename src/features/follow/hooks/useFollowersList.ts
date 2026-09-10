import { useQuery } from "@tanstack/react-query";
import { getFollowers } from "../services/follow.service";
import type { PageableParams } from "@/types/api.types";

export function useFollowersList(
  userId: string | undefined,
  pageable?: PageableParams,
  enabled = true
) {
  return useQuery({
    queryKey: ["follows", "followers", userId, pageable?.page ?? 0],
    queryFn: () => getFollowers(userId as string, pageable),
    enabled: !!userId && enabled,
    staleTime: 0,
    refetchOnMount: "always",
  });
}
