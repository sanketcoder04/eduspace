import { useMutation, useQueryClient } from "@tanstack/react-query";
import { submitStudentVerification } from "../services/profile.service";

export function useSubmitStudentVerification() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: submitStudentVerification,
    onSuccess: (profile) => {
      queryClient.setQueryData(["profile", "student", "me"], profile);
    },
  });
}
