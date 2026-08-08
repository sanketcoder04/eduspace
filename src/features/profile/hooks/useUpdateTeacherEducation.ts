import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateTeacherEducation } from "../services/profile.service";

export function useUpdateTeacherEducation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateTeacherEducation,
    onSuccess: (profile) => {
      queryClient.setQueryData(["profile", "teacher", "me"], profile);
    },
  });
}
