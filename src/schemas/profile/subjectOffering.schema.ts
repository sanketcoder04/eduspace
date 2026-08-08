import { z } from "zod";

export const subjectOfferingSchema = z.object({
  subjectName: z.string().trim().min(1, "Subject name is required"),
  qualificationLevel: z.string().trim().min(1, "Qualification level is required"),
  resumeUrl: z.string().trim().optional(),
  certificateUrls: z.array(z.string()).default([]),
});

export type SubjectOfferingFormValues = z.infer<typeof subjectOfferingSchema>;
