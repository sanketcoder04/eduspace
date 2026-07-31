import { useMutation } from "@tanstack/react-query";
import { verifyPasswordResetOtp } from "../services/auth.service";

export function useVerifyPasswordResetOtp() {
  return useMutation({
    mutationFn: verifyPasswordResetOtp,
  });
}
