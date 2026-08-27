import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateContactConsent } from "../services/application.service";
import type { ContactShareConsentRequest } from "../types/application.types";

export function useUpdateContactConsent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: ContactShareConsentRequest }) =>
      updateContactConsent(id, payload),
    onSuccess: () => {
      // Refreshes both tabs since either party might currently be viewing this application.
      queryClient.invalidateQueries({ queryKey: ["applications", "sent"] });
      queryClient.invalidateQueries({ queryKey: ["applications", "received"] });
    },
  });
}
