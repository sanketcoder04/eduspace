import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateStudentResume } from "../services/profile.service";

export function useUpdateStudentResume() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateStudentResume,
    onSuccess: (profile) => {
      queryClient.setQueryData(["profile", "student", "me"], profile);
    },
  });
}
