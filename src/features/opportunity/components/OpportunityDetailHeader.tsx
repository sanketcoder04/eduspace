import { Avatar, Tag } from "antd";
import { User as UserIcon } from "lucide-react";
import { formatRelativeTime } from "@/utils/formatDate";
import type { OpportunityResponse } from "@/features/opportunity/types/opportunity.types";
import { OPPORTUNITY_STATUS_LABEL } from "@/features/opportunity/constants/opportunityOptions";

const STATUS_TAG_COLOR: Record<OpportunityResponse["status"], string> = {
  OPEN: "green",
  PARTIALLY_FILLED: "gold",
  CLOSED: "default",
  EXPIRED: "default",
};

export default function OpportunityDetailHeader({
  opportunity,
}: {
  opportunity: OpportunityResponse;
}) {
  return (
    <div className="mb-4 flex items-start justify-between gap-3">
      <div className="flex items-center gap-3">
        <Avatar
          size={48}
          src={opportunity.authorAvatarUrl}
          icon={!opportunity.authorAvatarUrl && <UserIcon size={22} />}
        />
        <div>
          <p className="font-semibold text-gray-900 dark:text-white">{opportunity.authorName}</p>
          <p className="text-xs text-gray-500">
            {opportunity.authorRole === "TEACHER" ? "Teacher" : "Student"} ·{" "}
            {formatRelativeTime(opportunity.createdAt)}
          </p>
        </div>
      </div>
      <Tag color={STATUS_TAG_COLOR[opportunity.status]} className="rounded-full">
        {OPPORTUNITY_STATUS_LABEL[opportunity.status]}
      </Tag>
    </div>
  );
}
