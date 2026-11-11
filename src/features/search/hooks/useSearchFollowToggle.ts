import { useMutation, useQueryClient, type InfiniteData } from "@tanstack/react-query";
import { followUser, unfollowUser } from "@/features/follow/services/follow.service";
import { DISCOVER_QUERY_KEY } from "./useUserSearch";
import type { SearchPage } from "../types/search.types";

type DiscoverCache = InfiniteData<SearchPage>;

export function useSearchFollowToggle() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ userId, follow }: { userId: string; follow: boolean }) =>
      follow ? followUser(userId) : unfollowUser(userId),

    onMutate: async ({ userId, follow }) => {
      await queryClient.cancelQueries({ queryKey: DISCOVER_QUERY_KEY });

      const previous = queryClient.getQueriesData<DiscoverCache>({ queryKey: DISCOVER_QUERY_KEY });

      queryClient.setQueriesData<DiscoverCache>({ queryKey: DISCOVER_QUERY_KEY }, (cached) => {
        if (!cached?.pages) return cached;
        return {
          ...cached,
          pages: cached.pages.map((page) => ({
            ...page,
            content: page.content.map((user) =>
              user.userId === userId ? { ...user, following: follow } : user
            ),
          })),
        };
      });

      return { previous };
    },

    onError: (_error, _variables, context) => {
      context?.previous.forEach(([key, data]) => queryClient.setQueryData(key, data));
    },

    onSettled: (_data, _error, { userId }) => {
      queryClient.invalidateQueries({ queryKey: ["follows", "status", userId] });
      queryClient.invalidateQueries({ queryKey: ["follows", "stats"] });
      queryClient.invalidateQueries({ queryKey: ["follows", "recommendations"] });
    },
  });
}
