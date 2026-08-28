import type { ApplicationStatus } from "../types/application.types";

export const APPLICATION_STATUS_LABEL: Record<ApplicationStatus, string> = {
  PENDING: "Pending",
  APPROVED: "Approved",
  REJECTED: "Rejected",
  WITHDRAWN: "Withdrawn",
};

export const APPLICATION_STATUS_TAG_COLOR: Record<ApplicationStatus, string> = {
  PENDING: "gold",
  APPROVED: "green",
  REJECTED: "red",
  WITHDRAWN: "default",
};
