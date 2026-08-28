import { z } from "zod";

export const timeSlotSchema = z
  .object({
    day: z.enum(["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY", "SUNDAY"]),
    startTime: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, "Use 24h format, e.g. 17:00"),
    endTime: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, "Use 24h format, e.g. 18:30"),
  })
  .refine((data) => data.endTime > data.startTime, {
    path: ["endTime"],
    message: "End time must be after start time",
  });

export type TimeSlotFormValues = z.infer<typeof timeSlotSchema>;
