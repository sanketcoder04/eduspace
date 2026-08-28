import { Card, Tag, Avatar, Button } from "antd";
import { Link } from "react-router-dom";
import {
  MapPin,
  Video,
  Building2,
  Users,
  Clock,
  Calendar,
  BookOpen,
  User as UserIcon,
} from "lucide-react";
import { formatRelativeTime } from "@/utils/formatDate";
import { FEE_UNIT_LABEL, OPPORTUNITY_STATUS_LABEL } from "../constants/opportunityOptions";
import type { OpportunityResponse } from "../types/opportunity.types";
import { ROUTES } from "@/router/routes";

interface OpportunityCardProps {
  opportunity: OpportunityResponse;
}

const STATUS_TAG_COLOR: Record<OpportunityResponse["status"], string> = {
  OPEN: "green",
  PARTIALLY_FILLED: "gold",
  CLOSED: "default",
  EXPIRED: "default",
};

export default function OpportunityCard({ opportunity }: OpportunityCardProps) {
  const {
    id,
    postType,
    title,
    subjects,
    gradeLevel,
    description,
    mode,
    classFormat,
    location,
    feeRange,
    sessionDurationHours,
    sessionsPerWeek,
    status,
    authorName,
    authorAvatarUrl,
    authorRole,
    applicationsCount,
    createdAt,
    teachingOpeningDetails,
  } = opportunity;

  const isTeachingOpening = postType === "TEACHING_OPENING";

  return (
    <Card
      className="rounded-2xl shadow-sm hover:shadow-md transition-shadow"
      bodyStyle={{ padding: 0 }}
    >
      <div className="p-5">
        {/* Header: author + status */}
        <div className="mb-3 flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <Avatar
              size={40}
              src={authorAvatarUrl}
              icon={!authorAvatarUrl && <UserIcon size={20} />}
            />
            <div>
              <p className="text-sm font-semibold text-gray-900 dark:text-white">{authorName}</p>
              <p className="text-xs text-gray-500">
                {authorRole === "TEACHER" ? "Teacher" : "Student"} · {formatRelativeTime(createdAt)}
              </p>
            </div>
          </div>

          <Tag color={STATUS_TAG_COLOR[status]} className="rounded-full">
            {OPPORTUNITY_STATUS_LABEL[status]}
          </Tag>
        </div>

        {/* Title + subjects */}
        <Link to={ROUTES.OPPORTUNITY_DETAIL(id)} className="block">
          <h3 className="mb-1 text-lg font-bold text-gray-900 hover:text-racing-red-600 dark:text-white">
            {title}
          </h3>
        </Link>

        <div className="mb-3 flex flex-wrap gap-1.5">
          {subjects.slice(0, 4).map((subject) => (
            <Tag
              key={subject}
              className="rounded-full bg-racing-red-50 text-racing-red-600 border-0 dark:bg-racing-red-950"
            >
              {subject}
            </Tag>
          ))}
          {subjects.length > 4 && <Tag className="rounded-full">+{subjects.length - 4} more</Tag>}
        </div>

        <p className="mb-4 line-clamp-2 text-sm text-gray-600 dark:text-gray-300">{description}</p>

        {/* Key facts grid */}
        <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm text-gray-600 dark:text-gray-300 sm:grid-cols-3">
          <InfoItem icon={mode === "ONLINE" ? <Video size={14} /> : <Building2 size={14} />}>
            {mode === "ONLINE" ? "Online" : mode === "OFFLINE" ? "Offline" : "Hybrid"}
          </InfoItem>

          <InfoItem icon={<Users size={14} />}>
            {classFormat === "BATCH" ? "Batch" : "Personalized"}
          </InfoItem>

          {location?.city && <InfoItem icon={<MapPin size={14} />}>{location.city}</InfoItem>}

          {gradeLevel && <InfoItem icon={<BookOpen size={14} />}>{gradeLevel}</InfoItem>}

          {sessionDurationHours && (
            <InfoItem icon={<Clock size={14} />}>{sessionDurationHours} hrs/session</InfoItem>
          )}

          {sessionsPerWeek && (
            <InfoItem icon={<Calendar size={14} />}>{sessionsPerWeek}x / week</InfoItem>
          )}
        </div>

        {isTeachingOpening && teachingOpeningDetails?.batchCapacity && (
          <p className="mt-2 text-xs font-medium text-racing-red-600">
            {Math.max(0, teachingOpeningDetails.batchCapacity - teachingOpeningDetails.seatsFilled)}{" "}
            of {teachingOpeningDetails.batchCapacity} seats left
          </p>
        )}
      </div>

      {/* Footer: fee + apply */}
      <div className="flex flex-col gap-3 border-t border-gray-100 px-4 py-3 dark:border-neutral-800 sm:flex-row sm:items-center sm:justify-between sm:px-5">
        <div className="flex items-center justify-between sm:block">
          <div>
            <span className="text-lg font-bold text-gray-900 dark:text-white">
              ₹{feeRange.min}
              {feeRange.max !== feeRange.min ? `–${feeRange.max}` : ""}
            </span>
            <span className="ml-1 text-xs text-gray-500">{FEE_UNIT_LABEL[feeRange.unit]}</span>
          </div>
          <span className="text-xs text-gray-400 sm:hidden">{applicationsCount} applied</span>
        </div>

        <div className="flex items-center gap-2 sm:justify-end">
          <span className="hidden text-xs text-gray-400 sm:inline">
            {applicationsCount} applied
          </span>
          <Link to={ROUTES.OPPORTUNITY_DETAIL(id)} className="w-full sm:w-auto">
            <Button
              type="primary"
              size="small"
              className="w-full rounded-lg font-semibold sm:w-auto"
            >
              View Details
            </Button>
          </Link>
        </div>
      </div>
    </Card>
  );
}

function InfoItem({ icon, children }: { icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <span className="flex items-center gap-1.5">
      <span className="text-racing-red-500">{icon}</span>
      {children}
    </span>
  );
}
