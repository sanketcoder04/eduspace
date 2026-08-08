import { z } from "zod";
import { addressSchema } from "./address.schema";

export const verificationSchema = z.object({
  selfieUrl: z.string().trim().min(1, "Please capture a selfie to continue"),
  address: addressSchema,
});

export type VerificationFormValues = z.infer<typeof verificationSchema>;
