import { z } from "zod";

export const resendOtpSchema = z.object({
  email: z.string().trim().email("Invalid email"),
});

export type ResendOtpFormValues = z.infer<typeof resendOtpSchema>;
