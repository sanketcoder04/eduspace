import { useQuery } from "@tanstack/react-query";
import { getTopLevelComments } from "../services/comment.service";
import type { PageableParams } from "@/types/api.types";

export function useTopLevelComments(postId: string | undefined, pageable?: PageableParams) {
  return useQuery({
    queryKey: ["comments", "top-level", postId, pageable?.page ?? 0],
    queryFn: () => getTopLevelComments(postId as string, pageable),
    enabled: !!postId,
  });
}
