import { useQuery } from "@tanstack/react-query";
import { getFeed } from "../services/post.service";
import type { PageableParams } from "@/types/api.types";

export function useFeed(pageable?: PageableParams) {
  return useQuery({
    queryKey: ["posts", "feed", pageable?.page ?? 0],
    queryFn: () => getFeed(pageable),
    placeholderData: (previousData) => previousData,
  });
}
