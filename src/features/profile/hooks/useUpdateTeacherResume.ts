import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateTeacherResume } from "../services/profile.service";

export function useUpdateTeacherResume() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateTeacherResume,
    onSuccess: (profile) => {
      queryClient.setQueryData(["profile", "teacher", "me"], profile);
    },
  });
}
