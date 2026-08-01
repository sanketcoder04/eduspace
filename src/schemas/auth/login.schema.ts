import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().trim().email("Please enter a valid email"),

  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(50)
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#^+=]).+$/,
      "Password must contain uppercase, lowercase, number and special character"
    ),
});

export type LoginFormValues = z.infer<typeof loginSchema>;
