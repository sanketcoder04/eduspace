import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteSubjectOffering } from "../services/profile.service";

export function useDeleteSubjectOffering() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteSubjectOffering,
    onSuccess: (profile) => {
      queryClient.setQueryData(["profile", "teacher", "me"], profile);
    },
  });
}
