import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateStudentCertificates } from "../services/profile.service";

export function useUpdateStudentCertificates() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateStudentCertificates,
    onSuccess: (profile) => {
      queryClient.setQueryData(["profile", "student", "me"], profile);
    },
  });
}
