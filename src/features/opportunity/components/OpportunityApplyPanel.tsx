import { useState } from "react";
import { Button, Alert } from "antd";
import { Link } from "react-router-dom";
import ApplyModal from "@/features/application/components/ApplyModal";
import ApplicationStatusTag from "@/features/application/components/ApplicationStatusTag";
import { useMyApplicationForOpportunity } from "@/features/application/hooks/useMyApplicationForOpportunity";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { ROUTES } from "@/router/routes";
import type { OpportunityResponse } from "@/features/opportunity/types/opportunity.types";

interface OpportunityApplyPanelProps {
  opportunity: OpportunityResponse;
}

export default function OpportunityApplyPanel({ opportunity }: OpportunityApplyPanelProps) {
  const [applyModalOpen, setApplyModalOpen] = useState(false);
  const { auth } = useAuth();

  const existingApplication = useMyApplicationForOpportunity(opportunity.id);

  const isOwnPosting = auth.user?.id === opportunity.authorId;

  const expectedApplicantRole = opportunity.postType === "TEACHING_OPENING" ? "STUDENT" : "TEACHER";
  const isEligibleApplicant = auth.user?.role === expectedApplicantRole;

  const isClosed = opportunity.status === "CLOSED" || opportunity.status === "EXPIRED";

  // Owner of this posting — direct them to the Applications page to manage responses, not an Apply button.
  if (isOwnPosting) {
    return (
      <Alert
        type="info"
        showIcon
        message="This is your posting"
        description={
          <span>
            Manage applications from the{" "}
            <Link
              to={ROUTES.APPLICATIONS}
              className="font-semibold text-racing-red-600 hover:underline"
            >
              Applications page
            </Link>
            .
          </span>
        }
        className="rounded-xl"
      />
    );
  }

  // Wrong account type for this posting (e.g. a Teacher viewing another Teacher's opening).
  if (!isEligibleApplicant) {
    return (
      <Alert
        type="warning"
        showIcon
        message="Ineligible to Apply"
        description={
          opportunity.postType === "TEACHING_OPENING"
            ? "Only students can apply to teaching openings."
            : "Only teachers can apply to tuition requirements."
        }
        className="rounded-xl"
      />
    );
  }

  // Already has an active application — show status instead of a duplicate apply button.
  if (existingApplication) {
    return (
      <div className="flex items-center justify-between rounded-xl border border-gray-200 p-4 dark:border-neutral-700">
        <div>
          <p className="text-sm font-medium text-gray-700 dark:text-gray-200">Your application</p>
          <p className="text-xs text-gray-400">
            {existingApplication.status === "APPROVED"
              ? "Approved — you can now chat with the author."
              : "Waiting for the author to review."}
          </p>
        </div>
        <ApplicationStatusTag status={existingApplication.status} />
      </div>
    );
  }

  if (isClosed) {
    return (
      <Alert
        type="error"
        showIcon
        message="Posting Closed"
        description="This posting is no longer accepting applications."
        className="rounded-xl"
      />
    );
  }

  return (
    <>
      <div className="flex flex-row items-center gap-4">
        <Button
          type="primary"
          onClick={() => setApplyModalOpen(true)}
          className="rounded-xl font-semibold"
        >
          Apply Now
        </Button>

        <p className="text-sm font-semibold text-gray-500">
          {opportunity.applicationsCount} Applicant(s)
        </p>
      </div>

      <ApplyModal
        opportunityId={opportunity.id}
        opportunityTitle={opportunity.title}
        open={applyModalOpen}
        onClose={() => setApplyModalOpen(false)}
      />
    </>
  );
}
