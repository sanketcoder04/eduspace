import { Avatar, Tag, Typography, Progress, Form } from "antd";
import { CheckCircle2, MapPin, GraduationCap, BookOpen, ShieldCheck } from "lucide-react";
import WizardStepFooter from "../../shared/WizardStepFooter";
import type {
  Address,
  Education,
  SubjectOffering,
  Verification,
} from "../../../types/profile.types";

const { Title, Text } = Typography;

interface ReviewStepProps {
  name: string;
  avatarUrl?: string;
  headline?: string;
  address?: Address;
  education: Education[];
  subjectOfferings?: SubjectOffering[];
  verification: Verification;
  completionPercent: number;
  onBack: () => void;
  onFinish: () => void;
}

export default function ReviewStep({
  name,
  avatarUrl,
  headline,
  address,
  education,
  subjectOfferings,
  verification,
  completionPercent,
  onBack,
  onFinish,
}: ReviewStepProps) {
  return (
    <Form layout="vertical" onFinish={onFinish}>
      <div className="mb-6 flex flex-col items-center gap-3 text-center">
        <Avatar size={80} src={avatarUrl}>
          {name?.charAt(0)}
        </Avatar>
        <div>
          <Title level={4} className="mb-0!">
            {name}
          </Title>
          {headline && <Text type="secondary">{headline}</Text>}
        </div>
        <Progress
          type="circle"
          size={64}
          percent={completionPercent}
          strokeColor="var(--color-racing-red-500)"
        />
      </div>

      <div className="space-y-4">
        {address && (
          <div className="flex items-start gap-3 rounded-xl border border-gray-200 p-4 dark:border-neutral-700">
            <MapPin size={18} className="mt-0.5 text-racing-red-500" />
            <div>
              <p className="font-semibold">Address</p>
              <p className="text-sm text-gray-500">
                {address.line1}, {address.city}, {address.state} {address.pincode},{" "}
                {address.country}
              </p>
            </div>
          </div>
        )}

        <div className="flex items-start gap-3 rounded-xl border border-gray-200 p-4 dark:border-neutral-700">
          <GraduationCap size={18} className="mt-0.5 text-racing-red-500" />
          <div>
            <p className="font-semibold">Education ({education.length})</p>
            {education.map((e) => (
              <p key={e.id ?? e.institution} className="text-sm text-gray-500">
                {e.degree} — {e.institution} ({e.startYear}–{e.endYear ?? "present"})
              </p>
            ))}
          </div>
        </div>

        {subjectOfferings && (
          <div className="flex items-start gap-3 rounded-xl border border-gray-200 p-4 dark:border-neutral-700">
            <BookOpen size={18} className="mt-0.5 text-racing-red-500" />
            <div>
              <p className="font-semibold">Subjects offered ({subjectOfferings.length})</p>
              <div className="mt-1 flex flex-wrap gap-1">
                {subjectOfferings.map((s) => (
                  <Tag key={s.id}>{s.subjectName}</Tag>
                ))}
              </div>
            </div>
          </div>
        )}

        <div className="flex items-start gap-3 rounded-xl border border-gray-200 p-4 dark:border-neutral-700">
          <ShieldCheck size={18} className="mt-0.5 text-racing-red-500" />
          <div>
            <p className="font-semibold">Verification</p>
            <p className="text-sm text-gray-500">
              {verification.status === "VERIFIED" ? (
                <span className="inline-flex items-center gap-1 text-green-600">
                  <CheckCircle2 size={14} /> Verified
                </span>
              ) : (
                "Pending review"
              )}
            </p>
          </div>
        </div>
      </div>

      <WizardStepFooter
        onBack={onBack}
        loading={false}
        isLastStep
        continueLabel="Go to my profile"
      />
    </Form>
  );
}
