import { useSentApplications } from "./useSentApplications";
import type { ApplicationResponse } from "../types/application.types";

/**
 * Finds the current user's own application (if any) for a given opportunity,
 * derived from the already-cached "sent applications" list rather than a
 * dedicated backend lookup. Only meaningful for the applicant's own view —
 * an opportunity's author checks applications via ReceivedApplicationCard
 * (Part 5) instead, not this hook.
 */

export function useMyApplicationForOpportunity(
  opportunityId: string | undefined
): ApplicationResponse | undefined {
  // size: 100 is a pragmatic cap — a single user applying to 100+ postings
  // concurrently is not a case worth paginating through here; revisit if
  // that assumption ever breaks.

  const { data } = useSentApplications({ page: 0, size: 100 });

  if (!opportunityId || !data) return undefined;

  return data.content.find(
    (application) =>
      application.opportunityId === opportunityId &&
      application.status !== "WITHDRAWN" &&
      application.status !== "REJECTED"
  );
}
