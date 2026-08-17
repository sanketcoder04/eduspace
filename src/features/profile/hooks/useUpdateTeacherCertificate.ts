import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateTeacherCertificate } from "../services/profile.service";
import type { UpdateCertificateRequest } from "../types/profile.types";

export function useUpdateTeacherCertificate() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      certificateId,
      payload,
    }: {
      certificateId: string;
      payload: UpdateCertificateRequest;
    }) => updateTeacherCertificate(certificateId, payload),
    onSuccess: (profile) => {
      queryClient.setQueryData(["profile", "teacher", "me"], profile);
    },
  });
}
