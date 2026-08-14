import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateStudentBasicInfo } from "../services/profile.service";

export function useUpdateStudentBasicInfo() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateStudentBasicInfo,
    onSuccess: (profile) => {
      queryClient.setQueryData(["profile", "student", "me"], profile);
    },
  });
}
