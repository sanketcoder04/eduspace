import { useMutation, useQueryClient } from "@tanstack/react-query";
import { markNotificationRead } from "../services/notification.service";

export function useMarkNotificationRead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: markNotificationRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });
}
