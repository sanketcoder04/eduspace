import type { ApplicationSort, ApplicationStatus } from "../types/application.types";

export const APPLICATION_STATUS_LABEL: Record<ApplicationStatus, string> = {
  PENDING: "Pending",
  IN_DISCUSSION: "In Discussion",
  APPROVED: "Approved",
  REJECTED: "Rejected",
  WITHDRAWN: "Withdrawn",
};

export const APPLICATION_STATUS_TAG_COLOR: Record<ApplicationStatus, string> = {
  PENDING: "gold",
  IN_DISCUSSION: "blue",
  APPROVED: "green",
  REJECTED: "red",
  WITHDRAWN: "default",
};

export const APPLICATION_STATUS_OPTIONS = (
  Object.entries(APPLICATION_STATUS_LABEL) as [ApplicationStatus, string][]
).map(([value, label]) => ({ value, label }));

export const APPLICATION_SORT_OPTIONS: { label: string; value: ApplicationSort }[] = [
  { label: "Newest first", value: "NEWEST" },
  { label: "Oldest first", value: "OLDEST" },
  { label: "Recently updated", value: "RECENTLY_UPDATED" },
];

export const APPLIED_WITHIN_OPTIONS = [
  { label: "Any time", value: 0 },
  { label: "Past 24 hours", value: 1 },
  { label: "Past week", value: 7 },
  { label: "Past month", value: 30 },
] as const;
