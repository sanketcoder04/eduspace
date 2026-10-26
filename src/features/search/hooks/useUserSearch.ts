import { useInfiniteQuery } from "@tanstack/react-query";
import { discoverUsers } from "../services/search.service";

/** Must match the backend's DISCOVER_MIN_QUERY_LENGTH. Shorter queries return nothing server-side anyway. */
export const MIN_SEARCH_LENGTH = 2;

export const DISCOVER_QUERY_KEY = ["follows", "discover"] as const;

export function useUserSearch(query: string) {
  const trimmed = query.trim();

  return useInfiniteQuery({
    queryKey: [...DISCOVER_QUERY_KEY, trimmed.toLowerCase()],
    queryFn: ({ pageParam, signal }) => discoverUsers(trimmed, pageParam, signal),
    initialPageParam: 0,
    // Page on the server's hasNext flag, never on how many rows came back:
    // a page can be short (or empty) when profile-less accounts are filtered out.
    getNextPageParam: (lastPage) => (lastPage.hasNext ? lastPage.page + 1 : undefined),
    enabled: trimmed.length >= MIN_SEARCH_LENGTH,
    placeholderData: (previousData) => previousData,
    staleTime: 1000 * 30,
  });
}
