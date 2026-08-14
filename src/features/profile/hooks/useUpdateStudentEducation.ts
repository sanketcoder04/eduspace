import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateStudentEducation } from "../services/profile.service";

export function useUpdateStudentEducation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateStudentEducation,
    onSuccess: (profile) => {
      queryClient.setQueryData(["profile", "student", "me"], profile);
    },
  });
}
