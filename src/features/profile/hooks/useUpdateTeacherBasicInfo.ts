import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateTeacherBasicInfo } from "../services/profile.service";

export function useUpdateTeacherBasicInfo() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateTeacherBasicInfo,
    onSuccess: (profile) => {
      queryClient.setQueryData(["profile", "teacher", "me"], profile);
    },
  });
}
