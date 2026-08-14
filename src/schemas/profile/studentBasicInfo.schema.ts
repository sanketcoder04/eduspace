import { z } from "zod";
import { addressSchema } from "./address.schema";

export const studentBasicInfoSchema = z.object({
  name: z.string().trim().min(3, "Full name must be at least 3 characters"),
  phoneNumber: z
    .string()
    .trim()
    .regex(/^[+]?[0-9]{10,15}$/, "Enter a valid phone number"),
  address: addressSchema,
  parentName: z.string().trim().min(3, "Parent/guardian name is required"),
  parentPhoneNumber: z
    .string()
    .trim()
    .regex(/^[+]?[0-9]{10,15}$/, "Enter a valid phone number")
    .optional()
    .or(z.literal("")),
  gender: z.enum(["MALE", "FEMALE", "OTHER"]).optional(),
  headline: z.string().trim().max(120, "Keep the headline under 120 characters").optional(),
  about: z.string().trim().max(1000, "Keep About under 1000 characters").optional(),
});

export type StudentBasicInfoFormValues = z.infer<typeof studentBasicInfoSchema>;
