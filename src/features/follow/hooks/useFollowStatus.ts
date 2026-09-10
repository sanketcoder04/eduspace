import { useQuery } from "@tanstack/react-query";
import { getFollowStatus } from "../services/follow.service";

export function useFollowStatus(userId: string | undefined) {
  return useQuery({
    queryKey: ["follows", "status", userId],
    queryFn: () => getFollowStatus(userId as string),
    enabled: !!userId,
  });
}
