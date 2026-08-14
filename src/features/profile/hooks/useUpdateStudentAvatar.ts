import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateStudentAvatar } from "../services/profile.service";

export function useUpdateStudentAvatar() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateStudentAvatar,
    onSuccess: (profile) => {
      queryClient.setQueryData(["profile", "student", "me"], profile);
    },
  });
}
