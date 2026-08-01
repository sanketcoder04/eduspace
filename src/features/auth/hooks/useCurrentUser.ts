import { useQuery } from "@tanstack/react-query";
import { getCurrentUser } from "../services/auth.service";

export function useCurrentUser(enabled: boolean) {
  return useQuery({
    queryKey: ["auth", "me"],
    queryFn: getCurrentUser,
    enabled,
    retry: false,
    staleTime: 1000 * 60 * 5,
  });
}
