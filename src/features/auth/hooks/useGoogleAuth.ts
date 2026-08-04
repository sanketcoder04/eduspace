import { useMutation } from "@tanstack/react-query";
import { googleAuth } from "../services/auth.service";

export function useGoogleAuth() {
  return useMutation({ mutationFn: googleAuth });
}
