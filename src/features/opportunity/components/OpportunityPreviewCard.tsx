import { Link } from "react-router-dom";
import { Tag } from "antd";
import { Video, Building2, Users } from "lucide-react";
import { FEE_UNIT_LABEL, OPPORTUNITY_STATUS_LABEL } from "../constants/opportunityOptions";
import { ROUTES } from "@/router/routes";
import type { OpportunityResponse } from "../types/opportunity.types";

const STATUS_TAG_COLOR: Record<OpportunityResponse["status"], string> = {
  OPEN: "green",
  PARTIALLY_FILLED: "gold",
  CLOSED: "default",
  EXPIRED: "default",
};

interface OpportunityPreviewCardProps {
  opportunity: OpportunityResponse;
}

export default function OpportunityPreviewCard({ opportunity }: OpportunityPreviewCardProps) {
  return (
    <Link
      to={ROUTES.OPPORTUNITY_DETAIL(opportunity.id)}
      className="flex w-64 shrink-0 flex-col gap-2 rounded-xl border border-gray-200 bg-white p-3 transition hover:border-racing-red-300 hover:shadow-sm dark:border-neutral-700 dark:bg-neutral-900"
    >
      <div className="flex items-start justify-between gap-2">
        <h4 className="line-clamp-2 text-sm font-semibold text-gray-900 dark:text-white">
          {opportunity.title}
        </h4>
        <Tag
          color={STATUS_TAG_COLOR[opportunity.status]}
          className="shrink-0 rounded-full text-[10px]"
        >
          {OPPORTUNITY_STATUS_LABEL[opportunity.status]}
        </Tag>
      </div>

      <div className="flex flex-wrap gap-1">
        {opportunity.subjects.slice(0, 2).map((subject) => (
          <Tag
            key={subject}
            className="rounded-full border-0 bg-racing-red-50 text-[10px] text-racing-red-600 dark:bg-racing-red-950"
          >
            {subject}
          </Tag>
        ))}
      </div>

      <div className="mt-auto flex items-center justify-between text-xs text-gray-400">
        <span className="flex items-center gap-1">
          {opportunity.mode === "ONLINE" ? (
            <Video size={12} className="text-racing-red-500" />
          ) : (
            <Building2 size={12} className="text-racing-red-500" />
          )}
          {opportunity.mode === "ONLINE"
            ? "Online"
            : opportunity.mode === "OFFLINE"
              ? "Offline"
              : "Hybrid"}
        </span>
        <span className="flex items-center gap-1 text-racing-red-600">
          <Users size={12} />
          {opportunity.applicationsCount}
        </span>
      </div>

      <p className="text-sm font-semibold text-gray-900 dark:text-white">
        ₹{opportunity.feeRange.min}
        {opportunity.feeRange.max !== opportunity.feeRange.min
          ? `–${opportunity.feeRange.max}`
          : ""}
        <span className="ml-1 text-xs font-normal text-gray-400">
          {FEE_UNIT_LABEL[opportunity.feeRange.unit]}
        </span>
      </p>
    </Link>
  );
}
