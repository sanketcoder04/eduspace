import type { Address } from "@/features/profile/types/profile.types";

export type PostType = "TEACHING_OPENING" | "TUITION_REQUIREMENT";
export type Mode = "ONLINE" | "OFFLINE" | "HYBRID";
export type ClassFormat = "PERSONALIZED" | "BATCH";
export type TuitionLocationType = "HOME_TUITION" | "CENTER_BASED";
export type FeeUnit = "PER_HOUR" | "PER_SESSION" | "PER_MONTH" | "FULL_COURSE";
export type OpportunityStatus = "OPEN" | "PARTIALLY_FILLED" | "CLOSED" | "EXPIRED";
export type PreferredTutorGender = "MALE" | "FEMALE" | "NO_PREFERENCE";
export type PreferredTutorExperienceLevel =
  "PROFESSIONAL_TUTOR" | "PART_TIME_TUTOR" | "NO_PREFERENCE";
export type WeekDay =
  "MONDAY" | "TUESDAY" | "WEDNESDAY" | "THURSDAY" | "FRIDAY" | "SATURDAY" | "SUNDAY";

export interface FeeRange {
  min: number;
  max: number;
  currency: string;
  unit: FeeUnit;
}

export interface TimeSlot {
  day: WeekDay;
  startTime: string; // "17:00", 24h
  endTime: string;
}

export interface TeachingOpeningDetails {
  batchCapacity?: number;
  seatsFilled: number;
  availableSlots?: TimeSlot[];
  languageOfInstruction?: string;
  freeDemoAvailable: boolean;
  yearsOfExperienceInSubject?: number;
}

export interface TuitionRequirementDetails {
  preferredTutorGender?: PreferredTutorGender;
  preferredTutorExperienceLevel?: PreferredTutorExperienceLevel;
  numberOfStudents: number;
  additionalRequirements?: string;
}

export interface OpportunityResponse {
  id: string;
  authorId: string;
  authorRole: "TEACHER" | "STUDENT";
  authorName: string;
  authorAvatarUrl?: string;

  postType: PostType;
  title: string;
  subjects: string[];
  gradeLevel?: string;
  board?: string;
  description: string;

  mode: Mode;
  classFormat: ClassFormat;
  location?: Address;
  tuitionLocationType?: TuitionLocationType;

  feeRange: FeeRange;
  sessionDurationHours?: number;
  sessionsPerWeek?: number;
  preferredStartDate?: string;

  status: OpportunityStatus;
  applicationsCount: number;

  teachingOpeningDetails?: TeachingOpeningDetails;
  tuitionRequirementDetails?: TuitionRequirementDetails;

  createdAt: string;
  updatedAt: string;
}

// ---- Requests ----

export interface CreateTeachingOpeningRequest {
  title: string;
  subjects: string[];
  gradeLevel?: string;
  board?: string;
  description: string;
  mode: Mode;
  classFormat: ClassFormat;
  location?: Address;
  tuitionLocationType?: TuitionLocationType;
  feeRange: FeeRange;
  sessionDurationHours?: number;
  sessionsPerWeek?: number;
  preferredStartDate?: string;
  batchCapacity?: number;
  availableSlots?: TimeSlot[];
  languageOfInstruction?: string;
  freeDemoAvailable?: boolean;
  yearsOfExperienceInSubject?: number;
}

export interface CreateTuitionRequirementRequest {
  title: string;
  subjects: string[];
  gradeLevel?: string;
  board?: string;
  description: string;
  mode: Mode;
  classFormat: ClassFormat;
  location?: Address;
  tuitionLocationType?: TuitionLocationType;
  feeRange: FeeRange;
  sessionDurationHours?: number;
  sessionsPerWeek?: number;
  preferredStartDate?: string;
  preferredTutorGender?: PreferredTutorGender;
  preferredTutorExperienceLevel?: PreferredTutorExperienceLevel;
  numberOfStudents?: number;
  additionalRequirements?: string;
}

/** Every array field here is a multi-select filter per the spec. */
export interface OpportunityFilterRequest {
  postType?: PostType;
  cities?: string[];
  modes?: Mode[];
  classFormats?: ClassFormat[];
  subjects?: string[];
  minFee?: number;
  maxFee?: number;
  postedAfter?: string; // ISO instant — e.g. now-7d for "date posted" filter
  statuses?: OpportunityStatus[]; // used by "my posts", not the public feed
  authorId?: string; // used by "my posts"
}
