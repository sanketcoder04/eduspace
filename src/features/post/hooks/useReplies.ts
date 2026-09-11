import { useQuery } from "@tanstack/react-query";
import { getReplies } from "../services/comment.service";

export function useReplies(commentId: string | undefined, enabled: boolean) {
  return useQuery({
    queryKey: ["comments", "replies", commentId],
    queryFn: () => getReplies(commentId as string, { page: 0, size: 50 }),
    enabled: !!commentId && enabled,
  });
}
