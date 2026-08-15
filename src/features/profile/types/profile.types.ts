export type Gender = "MALE" | "FEMALE" | "OTHER";

export type VerificationStatus = "NOT_SUBMITTED" | "PENDING" | "VERIFIED" | "REJECTED";

export interface Address {
  line1: string;
  line2?: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
  latitude?: number | null;
  longitude?: number | null;
}

export interface Education {
  id?: string;
  institution: string;
  degree: string;
  fieldOfStudy?: string;
  board?: string;
  startYear: number;
  endYear?: number;
}

export interface SubjectOffering {
  id: string;
  subjectName: string;
  qualificationLevel: string;
  addedAt: string;
  updatedAt?: string;
}

export interface Verification {
  status: VerificationStatus;
  selfieUrl?: string;
  verifiedAddress?: Address;
  locationVerified: boolean;
  faceVerified: boolean;
  rejectionReason?: string;
  submittedAt?: string;
  verifiedAt?: string;
}

export interface TeacherProfile {
  id: string;
  userId: string;
  email: string;
  name: string;
  phoneNumber?: string;
  address?: Address;
  gender?: Gender;
  headline?: string;
  about?: string;
  avatarUrl?: string;
  coverImageUrl?: string;
  education: Education[];
  subjectOfferings: SubjectOffering[];
  resumeUrl?: string;
  certificateUrls?: string[];
  verification: Verification;
  profileCompleted: boolean;
  profileCompletionPercent: number;
  profileViews: number;
  createdAt: string;
  updatedAt: string;
  lastLoginAt?: string;
}

export interface StudentProfile {
  id: string;
  userId: string;
  email: string;
  name: string;
  phoneNumber?: string;
  address?: Address;
  parentName?: string;
  parentPhoneNumber?: string;
  gender?: Gender;
  headline?: string;
  about?: string;
  avatarUrl?: string;
  coverImageUrl?: string;
  education: Education[];
  verification: Verification;
  profileViews: number;
  createdAt: string;
  updatedAt: string;
  lastLoginAt?: string;
  profileCompleted: boolean;
  profileCompletionPercent: number;
  resumeUrl?: string;
  certificateUrls?: string[];
}

// ---- Requests ----

export interface UpdateTeacherBasicInfoRequest {
  name: string;
  phoneNumber: string;
  address: Address;
  gender?: Gender;
  headline?: string;
  about?: string;
}

export interface UpdateStudentBasicInfoRequest {
  name: string;
  phoneNumber: string;
  address: Address;
  parentName: string;
  parentPhoneNumber?: string;
  gender?: Gender;
  headline?: string;
  about?: string;
}

export interface UpdateEducationListRequest {
  education: Education[];
}

export interface AddSubjectOfferingRequest {
  subjectName: string;
  qualificationLevel: string;
}

export type UpdateSubjectOfferingRequest = AddSubjectOfferingRequest;

export interface SubmitVerificationRequest {
  selfieUrl: string;
  address: Address;
}

export interface UpdateImageRequest {
  url: string;
}

export type MediaFolder = "AVATAR" | "COVER" | "RESUME" | "CERTIFICATE" | "SELFIE";
