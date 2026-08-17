import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteTeacherResume } from "../services/profile.service";

export function useDeleteTeacherResume() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteTeacherResume,
    onSuccess: (profile) => {
      queryClient.setQueryData(["profile", "teacher", "me"], profile);
    },
  });
}
