import { z } from "zod";

export const addressSchema = z.object({
  line1: z.string().trim().min(1, "Address line 1 is required"),
  line2: z.string().trim().optional(),
  city: z.string().trim().min(1, "City is required"),
  state: z.string().trim().min(1, "State is required"),
  pincode: z.string().trim().min(1, "Pincode is required"),
  country: z.string().trim().min(1, "Country is required"),
  latitude: z.number().nullable().optional(),
  longitude: z.number().nullable().optional(),
});

export type AddressFormValues = z.infer<typeof addressSchema>;
