import { useMutation, useQueryClient } from "@tanstack/react-query";
import { voteOnPoll } from "../services/post.service";
import type { VoteRequest } from "../types/post.types";

export function useVoteOnPoll() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ postId, payload }: { postId: string; payload: VoteRequest }) =>
      voteOnPoll(postId, payload),
    onSuccess: () => {
      // Poll results (counts/percentages) are computed server-side — a full
      // refetch is simplest and correct here rather than hand-computing
      // percentages optimistically on the client.
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
  });
}
