import { z } from "zod";
import { feeRangeSchema } from "./feeRange.schema";
import { timeSlotSchema } from "./timeSlot.schema";
import { locationModeSchema } from "./locationMode.schema";

export const teachingOpeningSchema = z
  .object({
    title: z.string().trim().min(5, "Title must be at least 5 characters").max(120),
    subjects: z.array(z.string()).min(1, "Select at least one subject"),
    gradeLevel: z.string().trim().optional(),
    board: z.string().trim().optional(),
    description: z.string().trim().min(20, "Add a bit more detail (min 20 characters)").max(2000),

    feeRange: feeRangeSchema,
    sessionDurationHours: z.number().positive("Must be greater than 0").optional(),
    sessionsPerWeek: z.number().int().positive("Must be a whole number greater than 0").optional(),
    preferredStartDate: z.string().optional(), // ISO date string from the AntD DatePicker

    batchCapacity: z.number().int().positive().optional(),
    availableSlots: z.array(timeSlotSchema).optional(),
    languageOfInstruction: z.string().trim().optional(),
    freeDemoAvailable: z.boolean().default(false),
    yearsOfExperienceInSubject: z.number().int().min(0).optional(),
  })
  .and(locationModeSchema)
  .superRefine((data, ctx) => {
    if (data.classFormat === "BATCH" && !data.batchCapacity) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["batchCapacity"],
        message: "Batch capacity is required for a batch format",
      });
    }
  });

export type TeachingOpeningFormValues = z.infer<typeof teachingOpeningSchema>;
