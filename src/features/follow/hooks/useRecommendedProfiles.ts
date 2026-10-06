import { useQuery } from "@tanstack/react-query";
import { getRecommendedProfiles } from "../services/follow.service";

export function useRecommendedProfiles(limit = 5) {
  return useQuery({
    queryKey: ["follows", "recommendations", limit],
    queryFn: () => getRecommendedProfiles(limit),
    staleTime: 1000 * 60,
  });
}
