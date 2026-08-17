import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addTeacherCertificate } from "../services/profile.service";

export function useAddTeacherCertificate() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: addTeacherCertificate,
    onSuccess: (profile) => {
      queryClient.setQueryData(["profile", "teacher", "me"], profile);
    },
  });
}
