import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteTeacherCertificate } from "../services/profile.service";

export function useDeleteTeacherCertificate() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteTeacherCertificate,
    onSuccess: (profile) => {
      queryClient.setQueryData(["profile", "teacher", "me"], profile);
    },
  });
}
