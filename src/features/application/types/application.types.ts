export type ApplicationStatus = "PENDING" | "IN_DISCUSSION" | "APPROVED" | "REJECTED" | "WITHDRAWN";

export interface ContactShareConsent {
  phoneShared: boolean;
  emailShared: boolean;
  updatedAt?: string;
  phoneNumber?: string;
  email?: string;
}

export interface ApplicationResponse {
  id: string;

  opportunityId: string;
  opportunityTitle: string;

  applicantId: string;
  applicantName: string;
  applicantAvatarUrl?: string;

  authorId: string;

  message?: string;
  status: ApplicationStatus;
  decisionReason?: string;
  respondedAt?: string;

  contactShareConsent: ContactShareConsent;

  createdAt: string;
}

export interface CreateApplicationRequest {
  opportunityId: string;
  message?: string;
}

export interface RejectApplicationRequest {
  reason?: string;
}

export interface ContactShareConsentRequest {
  phoneShared: boolean;
  emailShared: boolean;
}
