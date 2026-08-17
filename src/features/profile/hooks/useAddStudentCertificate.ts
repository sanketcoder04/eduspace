import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addStudentCertificate } from "../services/profile.service";

export function useAddStudentCertificate() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: addStudentCertificate,
    onSuccess: (profile) => {
      queryClient.setQueryData(["profile", "student", "me"], profile);
    },
  });
}
