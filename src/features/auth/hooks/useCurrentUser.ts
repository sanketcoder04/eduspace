import { useQuery } from "@tanstack/react-query";
import { getCurrentUser } from "../services/auth.service";

export function useCurrentUser(enabled: boolean) {
  return useQuery({
    queryKey: ["auth", "me"],
    queryFn: getCurrentUser,
    enabled,
    retry: 3,
    retryDelay: (attempt) => Math.min(1000 * 2 ** attempt, 8000),
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
    staleTime: 1000 * 60 * 5,
  });
}
