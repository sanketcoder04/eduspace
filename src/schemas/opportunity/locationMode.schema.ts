import { z } from "zod";
import { addressSchema } from "@/schemas/profile/address.schema";

/**
 * Shared refinement used by both post types: address is only required when
 * mode isn't fully ONLINE, mirroring OpportunityService#validateLocation on
 * the backend. Field is named `address` (not `location`) so it can be
 * rendered directly by the existing AddressFields component, which hardcodes
 * "address.*" paths — the API payload maps address -> location once, at
 * submit time, in each page.
 */
export const locationModeSchema = z
  .object({
    mode: z.enum(["ONLINE", "OFFLINE", "HYBRID"], { message: "Select a mode" }),
    classFormat: z.enum(["PERSONALIZED", "BATCH"], { message: "Select a class format" }),
    address: addressSchema.optional(),
    tuitionLocationType: z.enum(["HOME_TUITION", "CENTER_BASED"]).optional(),
  })
  .superRefine((data, ctx) => {
    if (data.mode !== "ONLINE" && !data.address) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["address"],
        message: "Address is required for offline or hybrid postings",
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

export type LocationModeFormValues = z.infer<typeof locationModeSchema>;
