import { useMutation, useQueryClient } from "@tanstack/react-query";
import { followUser, unfollowUser } from "../services/follow.service";

export function useFollowUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: followUser,
    onSuccess: (_data, userId) => {
      queryClient.invalidateQueries({ queryKey: ["follows", "status", userId] });
      queryClient.invalidateQueries({ queryKey: ["follows", "stats"] });
      queryClient.invalidateQueries({ queryKey: ["follows", "followers"] });
      queryClient.invalidateQueries({ queryKey: ["follows", "following"] });
    },
  });
}

export function useUnfollowUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: unfollowUser,
    onSuccess: (_data, userId) => {
      queryClient.invalidateQueries({ queryKey: ["follows", "status", userId] });
      queryClient.invalidateQueries({ queryKey: ["follows", "stats"] });
      queryClient.invalidateQueries({ queryKey: ["follows", "followers"] });
      queryClient.invalidateQueries({ queryKey: ["follows", "following"] });
    },
  });
}
