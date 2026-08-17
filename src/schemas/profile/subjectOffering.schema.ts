import { z } from "zod";

export const subjectOfferingSchema = z.object({
  subjectName: z.string().trim().min(1, "Subject name is required"),
  qualificationLevel: z.string().trim().min(1, "Qualification level is required"),
  // resume and certificates are profile-level now
});

export type SubjectOfferingFormValues = z.infer<typeof subjectOfferingSchema>;
