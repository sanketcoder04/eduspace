import { z } from "zod";

export const verifyEmailSchema = z.object({
  email: z.string().trim().email("Invalid email"),

  otp: z
    .string()
    .length(6, "OTP must contain exactly 6 digits")
    .regex(/^\d+$/, "OTP must contain only numbers"),
});

export type VerifyEmailFormValues = z.infer<typeof verifyEmailSchema>;
