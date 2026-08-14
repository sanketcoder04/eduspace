import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateTeacherCover } from "../services/profile.service";

export function useUpdateTeacherCover() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateTeacherCover,
    onSuccess: (profile) => {
      queryClient.setQueryData(["profile", "teacher", "me"], profile);
    },
  });
}
