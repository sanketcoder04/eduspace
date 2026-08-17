import type { ReactNode } from "react";
import { Typography, Tooltip, Divider } from "antd";
import { Mail, Phone, History, Eye, Mars, Venus, ClockPlus, ClockArrowLeft } from "lucide-react";
import { formatDate, formatRelativeTime } from "@/utils/formatDate";
import type { Gender } from "../../types/profile.types";

const { Title, Text } = Typography;

interface BasicInfoCardProps {
  isOwner: boolean;
  email?: string;
  phoneNumber?: string;
  gender?: Gender;
  createdAt?: string;
  updatedAt?: string;
  lastLoginAt?: string;
  profileViews?: number;
}

const GENDER_LABEL: Record<Gender, string> = {
  MALE: "Male",
  FEMALE: "Female",
  OTHER: "Other",
};

function InfoRow({ icon, label, value }: { icon: ReactNode; label?: string; value: string }) {
  return (
    <div className="flex items-start gap-3">
      <span className="mt-0.5 shrink-0 text-racing-red-500">{icon}</span>
      <div className="min-w-0">
        <Text type="secondary" className="block text-xs">
          {label}
        </Text>
        <Tooltip title={value}>
          <Text className="block truncate text-xs font-medium">{value}</Text>
        </Tooltip>
      </div>
    </div>
  );
}

export default function BasicInfoCard({
  isOwner,
  email,
  phoneNumber,
  gender,
  createdAt,
  updatedAt,
  lastLoginAt,
  profileViews,
}: BasicInfoCardProps) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
      <Title level={5} className="mb-4!">
        Basic Information
      </Title>

      <div className="space-y-4">
        {isOwner && email && <InfoRow icon={<Mail size={16} />} value={email} />}
        {isOwner && phoneNumber && (
          <InfoRow icon={<Phone size={16} />} value={`(+91) ${phoneNumber}`} />
        )}
        {gender && gender !== "OTHER" && (
          <InfoRow
            icon={gender === "MALE" ? <Mars size={16} /> : <Venus size={16} />}
            value={GENDER_LABEL[gender]}
          />
        )}
      </div>

      <Divider className="my-4!" />

      <div className="space-y-4">
        <InfoRow
          icon={<ClockPlus size={16} />}
          label="Account created"
          value={formatDate(createdAt)}
        />

        {isOwner && updatedAt && (
          <InfoRow
            icon={<History size={16} />}
            label="Last updated"
            value={formatRelativeTime(updatedAt)}
          />
        )}

        <InfoRow
          icon={<ClockArrowLeft size={16} />}
          label="Last login"
          value={formatRelativeTime(lastLoginAt)}
        />

        {isOwner && (
          <Tooltip title="Activates once profile search & discovery is live">
            <div>
              <InfoRow
                icon={<Eye size={16} />}
                label="Profile views"
                value={String(profileViews ?? 0)}
              />
            </div>
          </Tooltip>
        )}
      </div>
    </div>
  );
}
