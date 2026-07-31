import { z } from "zod";

export const forgotPasswordSchema = z.object({
  email: z.email("Please enter a valid Email").nonempty("Email is required"),
});

export type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;
