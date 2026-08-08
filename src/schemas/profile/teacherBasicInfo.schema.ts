import { z } from "zod";
import { addressSchema } from "./address.schema";

export const teacherBasicInfoSchema = z.object({
  name: z.string().trim().min(3, "Full name must be at least 3 characters"),
  phoneNumber: z
    .string()
    .trim()
    .regex(/^[+]?[0-9]{10,15}$/, "Enter a valid phone number"),
  address: addressSchema,
  gender: z.enum(["MALE", "FEMALE", "OTHER"]).optional(),
  headline: z.string().trim().max(120, "Keep the headline under 120 characters").optional(),
  about: z.string().trim().max(1000, "Keep About under 1000 characters").optional(),
});

export type TeacherBasicInfoFormValues = z.infer<typeof teacherBasicInfoSchema>;
