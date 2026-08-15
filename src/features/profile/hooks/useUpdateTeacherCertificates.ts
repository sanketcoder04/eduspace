import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateTeacherCertificates } from "../services/profile.service";

export function useUpdateTeacherCertificates() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateTeacherCertificates,
    onSuccess: (profile) => {
      queryClient.setQueryData(["profile", "teacher", "me"], profile);
    },
  });
}
