import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteStudentCertificate } from "../services/profile.service";

export function useDeleteStudentCertificate() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteStudentCertificate,
    onSuccess: (profile) => {
      queryClient.setQueryData(["profile", "student", "me"], profile);
    },
  });
}
