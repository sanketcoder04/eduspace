import { Switch, Typography, Tooltip } from "antd";
import { Phone, Mail, ShieldCheck } from "lucide-react";
import { useUpdateContactConsent } from "../hooks/useUpdateContactConsent";
import type { ApplicationResponse } from "../types/application.types";

const { Text } = Typography;

interface ContactConsentPanelProps {
  application: ApplicationResponse;
  /** Only the author who owns this application can toggle sharing — the applicant sees a read-only view instead. */
  isAuthor: boolean;
}

export default function ContactConsentPanel({ application, isAuthor }: ContactConsentPanelProps) {
  const updateMutation = useUpdateContactConsent();

  if (application.status !== "APPROVED") return null;

  const { phoneShared, emailShared } = application.contactShareConsent;

  const toggle = (field: "phoneShared" | "emailShared", checked: boolean) => {
    updateMutation.mutate({
      id: application.id,
      payload: {
        phoneShared: field === "phoneShared" ? checked : phoneShared,
        emailShared: field === "emailShared" ? checked : emailShared,
      },
    });
  };

  return (
    <div className="rounded-xl border border-gray-200 p-4 dark:border-neutral-700">
      <div className="mb-3 flex items-center gap-1.5">
        <ShieldCheck size={16} className="text-racing-red-500" />
        <Text strong className="text-sm">
          Contact Sharing
        </Text>
      </div>

      {isAuthor ? (
        <>
          <p className="mb-3 text-xs text-gray-500">
            Choose what to share with the applicant. You can change this anytime.
          </p>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2 text-sm">
                <Phone size={14} className="text-gray-400" /> Phone number
              </span>
              <Switch
                checked={phoneShared}
                loading={updateMutation.isPending}
                onChange={(checked) => toggle("phoneShared", checked)}
              />
            </div>
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2 text-sm">
                <Mail size={14} className="text-gray-400" /> Email address
              </span>
              <Switch
                checked={emailShared}
                loading={updateMutation.isPending}
                onChange={(checked) => toggle("emailShared", checked)}
              />
            </div>
          </div>
        </>
      ) : (
        <div className="space-y-2 text-sm">
          {!phoneShared && !emailShared && (
            <Text type="secondary" className="text-xs">
              The author hasn't shared contact details yet.
            </Text>
          )}
          {phoneShared && (
            <Tooltip title="Shared by the author">
              <span className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                <Phone size={14} className="text-green-600" /> Phone number shared
              </span>
            </Tooltip>
          )}
          {emailShared && (
            <Tooltip title="Shared by the author">
              <span className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                <Mail size={14} className="text-green-600" /> Email address shared
              </span>
            </Tooltip>
          )}
        </div>
      )}
    </div>
  );
}
