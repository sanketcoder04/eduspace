import { useQuery } from "@tanstack/react-query";
import { getFollowStats } from "../services/follow.service";

export function useFollowStats(userId: string | undefined) {
  return useQuery({
    queryKey: ["follows", "stats", userId],
    queryFn: () => getFollowStats(userId as string),
    enabled: !!userId,
  });
}
