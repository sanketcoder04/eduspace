import { z } from "zod";

export const educationEntrySchema = z
  .object({
    id: z.string().optional(),
    institution: z.string().trim().min(1, "Institution is required"),
    degree: z.string().trim().min(1, "Degree/qualification is required"),
    fieldOfStudy: z.string().trim().optional(),
    board: z.string().trim().optional(),
    startYear: z
      .number({ message: "Start year is required" })
      .min(1950)
      .max(new Date().getFullYear()),
    endYear: z
      .number()
      .min(1950)
      .max(new Date().getFullYear() + 10)
      .optional(),
  })
  .refine((data) => !data.endYear || data.endYear >= data.startYear, {
    path: ["endYear"],
    message: "End year must be after start year",
  });

export const educationListSchema = z.object({
  education: z.array(educationEntrySchema).min(1, "Add at least one education entry"),
});

export type EducationFormValues = z.infer<typeof educationListSchema>;
