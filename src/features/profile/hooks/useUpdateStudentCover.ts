import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateStudentCover } from "../services/profile.service";

export function useUpdateStudentCover() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateStudentCover,
    onSuccess: (profile) => {
      queryClient.setQueryData(["profile", "student", "me"], profile);
    },
  });
}
