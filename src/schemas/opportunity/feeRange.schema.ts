import { z } from "zod";

export const feeRangeSchema = z
  .object({
    min: z.number({ message: "Minimum fee is required" }).min(0, "Fee cannot be negative"),
    max: z.number({ message: "Maximum fee is required" }).min(0, "Fee cannot be negative"),
    currency: z.string().min(1, "Currency is required"),
    unit: z.enum(["PER_HOUR", "PER_SESSION", "PER_MONTH", "FULL_COURSE"], {
      message: "Select a fee unit",
    }),
  })
  .refine((data) => data.max >= data.min, {
    path: ["max"],
    message: "Maximum fee must be greater than or equal to minimum fee",
  });

export type FeeRangeFormValues = z.infer<typeof feeRangeSchema>;
