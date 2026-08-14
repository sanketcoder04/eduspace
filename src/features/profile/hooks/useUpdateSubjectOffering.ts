import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateSubjectOffering } from "../services/profile.service";
import type { UpdateSubjectOfferingRequest } from "../types/profile.types";

export function useUpdateSubjectOffering() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      subjectId,
      payload,
    }: {
      subjectId: string;
      payload: UpdateSubjectOfferingRequest;
    }) => updateSubjectOffering(subjectId, payload),
    onSuccess: (profile) => {
      queryClient.setQueryData(["profile", "teacher", "me"], profile);
    },
  });
}
