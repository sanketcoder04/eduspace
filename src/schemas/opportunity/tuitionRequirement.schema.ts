import { z } from "zod";
import { feeRangeSchema } from "./feeRange.schema";
import { locationModeSchema } from "./locationMode.schema";

export const tuitionRequirementSchema = z
  .object({
    title: z.string().trim().min(5, "Title must be at least 5 characters").max(120),
    subjects: z.array(z.string()).min(1, "Select at least one subject"),
    gradeLevel: z.string().trim().optional(),
    board: z.string().trim().optional(),
    description: z.string().trim().min(20, "Add a bit more detail (min 20 characters)").max(2000),

    feeRange: feeRangeSchema,
    sessionDurationHours: z.number().positive("Must be greater than 0").optional(),
    sessionsPerWeek: z.number().int().positive("Must be a whole number greater than 0").optional(),
    preferredStartDate: z.string().optional(),

    preferredTutorGender: z.enum(["MALE", "FEMALE", "NO_PREFERENCE"]).default("NO_PREFERENCE"),
    preferredTutorExperienceLevel: z
      .enum(["PROFESSIONAL_TUTOR", "PART_TIME_TUTOR", "NO_PREFERENCE"])
      .default("NO_PREFERENCE"),
    numberOfStudents: z.number().int().min(1).default(1),
    additionalRequirements: z.string().trim().max(500).optional(),
  })
  .and(locationModeSchema);

export type TuitionRequirementFormValues = z.infer<typeof tuitionRequirementSchema>;
