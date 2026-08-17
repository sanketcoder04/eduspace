import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateStudentCertificate } from "../services/profile.service";
import type { UpdateCertificateRequest } from "../types/profile.types";

export function useUpdateStudentCertificate() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      certificateId,
      payload,
    }: {
      certificateId: string;
      payload: UpdateCertificateRequest;
    }) => updateStudentCertificate(certificateId, payload),
    onSuccess: (profile) => {
      queryClient.setQueryData(["profile", "student", "me"], profile);
    },
  });
}
