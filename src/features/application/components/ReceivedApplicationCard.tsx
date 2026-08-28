import { useState } from "react";
import { Card, Avatar, Button, Input, Popconfirm, message, Typography } from "antd";
import { Link } from "react-router-dom";
import { User as UserIcon, MessageCircle, Check, X } from "lucide-react";
import ApplicationStatusTag from "./ApplicationStatusTag";
import ContactConsentPanel from "./ContactConsentPanel";
import { useApproveApplication } from "../hooks/useApproveApplication";
import { useRejectApplication } from "../hooks/useRejectApplication";
import { getErrorMessage } from "@/utils/getErrorMessage";
import { formatRelativeTime } from "@/utils/formatDate";
import type { ApplicationResponse } from "../types/application.types";
import { ROUTES } from "@/router/routes";

const { Text, Paragraph } = Typography;

interface ReceivedApplicationCardProps {
  application: ApplicationResponse;
}

export default function ReceivedApplicationCard({ application }: ReceivedApplicationCardProps) {
  const [rejectReason, setRejectReason] = useState("");
  const [showRejectInput, setShowRejectInput] = useState(false);

  const approveMutation = useApproveApplication();
  const rejectMutation = useRejectApplication();

  const handleApprove = async () => {
    try {
      await approveMutation.mutateAsync(application.id);
      message.success("Application approved — you can now chat.");
    } catch (error) {
      message.error(getErrorMessage(error, "Couldn't approve this application."));
    }
  };

  const handleReject = async () => {
    try {
      await rejectMutation.mutateAsync({
        id: application.id,
        payload: rejectReason.trim() ? { reason: rejectReason.trim() } : undefined,
      });
      message.success("Application rejected.");
      setShowRejectInput(false);
      setRejectReason("");
    } catch (error) {
      message.error(getErrorMessage(error, "Couldn't reject this application."));
    }
  };

  return (
    <Card className="rounded-2xl shadow-sm" bodyStyle={{ padding: 20 }}>
      <div className="flex items-start gap-3">
        <Avatar
          size={44}
          src={application.applicantAvatarUrl}
          icon={!application.applicantAvatarUrl && <UserIcon size={20} />}
        />

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <p className="font-semibold text-gray-900 dark:text-white">
                {application.applicantName}
              </p>
              <p className="text-xs text-gray-500">
                Applied to{" "}
                <Link
                  to={ROUTES.OPPORTUNITY_DETAIL(application.opportunityId)}
                  className="font-medium text-racing-red-600 hover:underline"
                >
                  {application.opportunityTitle}
                </Link>{" "}
                · {formatRelativeTime(application.createdAt)}
              </p>
            </div>
            <ApplicationStatusTag status={application.status} />
          </div>

          {application.message && (
            <Paragraph className="mt-2 mb-0! rounded-xl bg-gray-50 p-3 text-sm text-gray-600 dark:bg-neutral-800 dark:text-gray-300">
              {application.message}
            </Paragraph>
          )}

          {application.status === "REJECTED" && application.decisionReason && (
            <Text type="secondary" className="mt-2 block text-xs italic">
              Your reason: "{application.decisionReason}"
            </Text>
          )}

          {application.status === "PENDING" && (
            <div className="mt-3">
              {showRejectInput ? (
                <div className="space-y-2">
                  <Input.TextArea
                    rows={2}
                    value={rejectReason}
                    onChange={(e) => setRejectReason(e.target.value)}
                    placeholder="Optional reason for rejecting (shown to the applicant)"
                    className="rounded-xl"
                    maxLength={300}
                  />
                  <div className="flex gap-2">
                    <Button
                      danger
                      size="small"
                      loading={rejectMutation.isPending}
                      onClick={handleReject}
                      className="rounded-lg"
                    >
                      Confirm Reject
                    </Button>
                    <Button
                      size="small"
                      onClick={() => setShowRejectInput(false)}
                      className="rounded-lg"
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="flex gap-2">
                  <Button
                    type="primary"
                    size="small"
                    icon={<Check size={14} />}
                    loading={approveMutation.isPending}
                    onClick={handleApprove}
                    className="rounded-lg font-semibold"
                  >
                    Approve
                  </Button>
                  <Button
                    danger
                    size="small"
                    icon={<X size={14} />}
                    onClick={() => setShowRejectInput(true)}
                    className="rounded-lg"
                  >
                    Reject
                  </Button>
                </div>
              )}
            </div>
          )}

          {application.status === "APPROVED" && (
            <div className="mt-3 space-y-3">
              <Link to={ROUTES.CONVERSATION_FOR_APPLICATION(application.id)}>
                <Button
                  type="default"
                  size="small"
                  icon={<MessageCircle size={14} />}
                  className="rounded-lg"
                >
                  Open Chat
                </Button>
              </Link>

              <ContactConsentPanel application={application} isAuthor />

              <Popconfirm
                title="Reject this approved application?"
                description="This will close the chat. The applicant will be notified."
                okText="Reject"
                okButtonProps={{ danger: true }}
                onConfirm={handleReject}
              >
                <Button danger size="small" className="rounded-lg">
                  Reject Anyway
                </Button>
              </Popconfirm>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}
