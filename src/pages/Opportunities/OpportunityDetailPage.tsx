import { useParams } from "react-router-dom";
import { Typography, Tag, Skeleton, Result } from "antd";
import { useOpportunity } from "@/features/opportunity/hooks/useOpportunity";
import OpportunityDetailHeader from "@/features/opportunity/components/OpportunityDetailHeader";
import OpportunityDetailFacts from "@/features/opportunity/components/OpportunityDetailFacts";
import OpportunityApplyPanel from "@/features/opportunity/components/OpportunityApplyPanel";
import OpportunitySlotsTable from "@/features/opportunity/components/OpportunitySlotsTable";
import OpportunityAdditionalNotes from "@/features/opportunity/components/OpportunityAdditionalNotes";

const { Title, Paragraph } = Typography;

export default function OpportunityDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { data: opportunity, isLoading, isError } = useOpportunity(id);

  if (isLoading) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6 sm:py-8">
        <Skeleton active paragraph={{ rows: 6 }} />
      </div>
    );
  }

  if (isError || !opportunity) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-16">
        <Result
          status="404"
          title="Posting not found"
          subTitle="This posting may have been removed."
        />
      </div>
    );
  }

  const hasSlots =
    opportunity.postType === "TEACHING_OPENING" &&
    !!opportunity.teachingOpeningDetails?.availableSlots?.length;

  const hasAdditionalNotes =
    opportunity.postType === "TUITION_REQUIREMENT" &&
    !!opportunity.tuitionRequirementDetails?.additionalRequirements;

  const hasExtraContent = hasSlots || hasAdditionalNotes;

  return (
    <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6 sm:py-8">
      <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-neutral-800 dark:bg-neutral-900 sm:p-6">
        {/*
          `facts` spans both rows on the right. When its content is taller
          than `info` + `apply` combined, the grid stretches row 2 (apply's
          row) to make up the difference — apply's content would otherwise
          float at the TOP of that now-tall cell, leaving visible empty
          space below it. `flex flex-col justify-end` on the apply wrapper
          pushes its content to the BOTTOM of whatever height the grid gives
          that cell, so it always lines up flush with the bottom of the
          facts panel instead of leaving a gap beneath it.
        */}
        <div
          className="
            grid grid-cols-1 gap-5
            [grid-template-areas:'info'_'facts'_'apply']
            lg:grid-cols-[1fr_360px]
            lg:[grid-template-areas:'info_facts'_'apply_facts']
          "
        >
          <div className="[grid-area:info]">
            <OpportunityDetailHeader opportunity={opportunity} />

            <Title level={4} className="mb-2!">
              {opportunity.title}
            </Title>

            <div className="mb-4 flex flex-wrap gap-1.5">
              {opportunity.subjects.map((subject) => (
                <Tag
                  key={subject}
                  className="rounded-full border-0 bg-racing-red-50 text-racing-red-600 dark:bg-racing-red-950"
                >
                  {subject}
                </Tag>
              ))}
            </div>

            <Paragraph className="text-sm! whitespace-pre-line text-gray-600 dark:text-gray-300">
              {opportunity.description}
            </Paragraph>

            {hasExtraContent && (
              <div className="space-y-4">
                {hasSlots && opportunity.teachingOpeningDetails && (
                  <OpportunitySlotsTable details={opportunity.teachingOpeningDetails} />
                )}
                {hasAdditionalNotes &&
                  opportunity.tuitionRequirementDetails?.additionalRequirements && (
                    <OpportunityAdditionalNotes
                      notes={opportunity.tuitionRequirementDetails.additionalRequirements}
                    />
                  )}
              </div>
            )}
          </div>

          <div className="[grid-area:facts]">
            <OpportunityDetailFacts opportunity={opportunity} />
          </div>

          <div className="[grid-area:apply] flex flex-col justify-end border-t border-gray-100 pt-6 dark:border-neutral-800 lg:border-t-0 lg:pt-0">
            <OpportunityApplyPanel opportunity={opportunity} />
          </div>
        </div>
      </div>
    </div>
  );
}
