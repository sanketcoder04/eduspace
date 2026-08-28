import { z } from "zod";
import { addressSchema } from "@/schemas/profile/address.schema";

/**
 * Shared refinement used by both post types: location is only required when
 * mode isn't fully ONLINE, mirroring the backend's validateLocation check in
 * OpportunityService — keeping both sides in sync prevents a submission that
 * passes client validation but gets rejected server-side.
 */
export const locationModeSchema = z
  .object({
    mode: z.enum(["ONLINE", "OFFLINE", "HYBRID"], { message: "Select a mode" }),
    classFormat: z.enum(["PERSONALIZED", "BATCH"], { message: "Select a class format" }),
    location: addressSchema.optional(),
    tuitionLocationType: z.enum(["HOME_TUITION", "CENTER_BASED"]).optional(),
  })
  .superRefine((data, ctx) => {
    if (data.mode !== "ONLINE" && !data.location) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["location"],
        message: "Location is required for offline or hybrid postings",
      });
    }
    if (data.mode !== "ONLINE" && !data.tuitionLocationType) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["tuitionLocationType"],
        message: "Specify whether this is home tuition or center-based",
      });
    }
  });
