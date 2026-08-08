import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addSubjectOffering } from "../services/profile.service";

export function useAddSubjectOffering() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: addSubjectOffering,
    onSuccess: (profile) => {
      queryClient.setQueryData(["profile", "teacher", "me"], profile);
    },
  });
}
