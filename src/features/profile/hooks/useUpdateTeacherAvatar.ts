import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateTeacherAvatar } from "../services/profile.service";

export function useUpdateTeacherAvatar() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateTeacherAvatar,
    onSuccess: (profile) => {
      queryClient.setQueryData(["profile", "teacher", "me"], profile);
    },
  });
}
