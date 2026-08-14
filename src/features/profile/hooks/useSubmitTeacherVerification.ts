import { useMutation, useQueryClient } from "@tanstack/react-query";
import { submitTeacherVerification } from "../services/profile.service";

export function useSubmitTeacherVerification() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: submitTeacherVerification,
    onSuccess: (profile) => {
      queryClient.setQueryData(["profile", "teacher", "me"], profile);
    },
  });
}
