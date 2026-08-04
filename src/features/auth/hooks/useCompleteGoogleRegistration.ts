import { useMutation } from "@tanstack/react-query";
import { completeGoogleRegistration } from "../services/auth.service";

export function useCompleteGoogleRegistration() {
  return useMutation({ mutationFn: completeGoogleRegistration });
}
