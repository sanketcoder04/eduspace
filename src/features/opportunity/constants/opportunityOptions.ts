import type {
  Mode,
  ClassFormat,
  FeeUnit,
  TuitionLocationType,
  PreferredTutorGender,
  PreferredTutorExperienceLevel,
  OpportunityStatus,
} from "../types/opportunity.types";

export const MODE_OPTIONS: { label: string; value: Mode }[] = [
  { label: "Online", value: "ONLINE" },
  { label: "Offline", value: "OFFLINE" },
  { label: "Hybrid", value: "HYBRID" },
];

export const CLASS_FORMAT_OPTIONS: { label: string; value: ClassFormat }[] = [
  { label: "Personalized", value: "PERSONALIZED" },
  { label: "Batch (Group)", value: "BATCH" },
];

export const TUITION_LOCATION_TYPE_OPTIONS: { label: string; value: TuitionLocationType }[] = [
  { label: "Home Tutor (travels to student)", value: "HOME_TUITION" },
  { label: "Center-Based (student comes to teacher)", value: "CENTER_BASED" },
];

export const FEE_UNIT_OPTIONS: { label: string; value: FeeUnit }[] = [
  { label: "Per Hour", value: "PER_HOUR" },
  { label: "Per Session", value: "PER_SESSION" },
  { label: "Per Month", value: "PER_MONTH" },
  { label: "Full Course", value: "FULL_COURSE" },
];

export const PREFERRED_TUTOR_GENDER_OPTIONS: { label: string; value: PreferredTutorGender }[] = [
  { label: "No Preference", value: "NO_PREFERENCE" },
  { label: "Male", value: "MALE" },
  { label: "Female", value: "FEMALE" },
];

export const PREFERRED_TUTOR_EXPERIENCE_OPTIONS: {
  label: string;
  value: PreferredTutorExperienceLevel;
}[] = [
  { label: "No Preference", value: "NO_PREFERENCE" },
  { label: "Professional / Full-Time Tutor", value: "PROFESSIONAL_TUTOR" },
  { label: "Part-Time / Student Tutor", value: "PART_TIME_TUTOR" },
];

export const DATE_POSTED_OPTIONS = [
  { label: "Any time", value: 0 },
  { label: "Past 24 hours", value: 1 },
  { label: "Past week", value: 7 },
  { label: "Past month", value: 30 },
] as const;

export const OPPORTUNITY_STATUS_LABEL: Record<OpportunityStatus, string> = {
  OPEN: "Open",
  PARTIALLY_FILLED: "Partially Filled",
  CLOSED: "Closed",
  EXPIRED: "Expired",
};

export const FEE_UNIT_LABEL: Record<FeeUnit, string> = {
  PER_HOUR: "/ hour",
  PER_SESSION: "/ session",
  PER_MONTH: "/ month",
  FULL_COURSE: "full course",
};
