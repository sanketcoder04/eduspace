import { Card, Button, Popconfirm, message, Typography } from "antd";
import { Link } from "react-router-dom";
import { CircleCheckBig, MessageCircle, Trash2 } from "lucide-react";
import ApplicationStatusTag from "./ApplicationStatusTag";
import ContactConsentPanel from "./ContactConsentPanel";
import { useWithdrawApplication } from "../hooks/useWithdrawApplication";
import { getErrorMessage } from "@/utils/getErrorMessage";
import { formatRelativeTime } from "@/utils/formatDate";
import type { ApplicationResponse } from "../types/application.types";
import { ROUTES } from "@/router/routes";

const { Text, Paragraph } = Typography;

interface SentApplicationCardProps {
  application: ApplicationResponse;
}

export default function SentApplicationCard({ application }: SentApplicationCardProps) {
  const withdrawMutation = useWithdrawApplication();

  const handleWithdraw = async () => {
    try {
      await withdrawMutation.mutateAsync(application.id);
      message.success("Application withdrawn.");
    } catch (error) {
      message.error(getErrorMessage(error, "Couldn't withdraw this application."));
    }
  };

  const canWithdraw =
    application.status === "PENDING" ||
    application.status === "IN_DISCUSSION" ||
    application.status === "APPROVED";

  return (
    <Card className="rounded-md! shadow-sm" styles={{ body: { padding: 20 } }}>
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <Link
            to={ROUTES.OPPORTUNITY_DETAIL(application.opportunityId)}
            className="font-semibold text-gray-900 hover:text-racing-red-600 dark:text-white"
          >
            {application.opportunityTitle}
          </Link>
          <p className="text-xs text-gray-500">
            Applied {formatRelativeTime(application.createdAt)}
          </p>

          {application.message && (
            <Paragraph className="mt-2 mb-0! text-xs! text-gray-600 dark:text-gray-300">
              <span className="font-medium text-racing-red-600">Note:</span> {application.message}
            </Paragraph>
          )}

          {application.status === "REJECTED" && application.decisionReason && (
            <Text type="secondary" className="mt-2 block text-xs italic">
              <span className="font-medium text-racing-red-600">Reason:</span>
              {application.decisionReason}
            </Text>
          )}

          {(application.status === "IN_DISCUSSION" || application.status === "APPROVED") && (
            <div className="mt-3 space-y-3">
              <Link to={ROUTES.CONVERSATION_FOR_APPLICATION(application.id)}>
                <Button
                  type="primary"
                  size="small"
                  icon={<MessageCircle size={14} />}
                  className="rounded-lg font-semibold mb-2"
                >
                  Open Chat
                </Button>
              </Link>
              <ContactConsentPanel application={application} isAuthor={false} />
              {application.status === "APPROVED" && (
                <p className="text-xs font-semibold text-green-600 flex gap-1 items-center">
                  This application has been finalized. <CircleCheckBig size={16} />
                </p>
              )}
            </div>
          )}

          {canWithdraw && (
            <Popconfirm
              title="Withdraw this application?"
              description={
                application.status === "APPROVED"
                  ? "This will close the chat with the author."
                  : undefined
              }
              okText="Withdraw"
              okButtonProps={{ danger: true, loading: withdrawMutation.isPending }}
              onConfirm={handleWithdraw}
            >
              <Button danger size="small" className="mt-3 rounded-lg" icon={<Trash2 size={14} />}>
                Withdraw
              </Button>
            </Popconfirm>
          )}
        </div>

        <div className="flex flex-col items-end gap-2">
          <ApplicationStatusTag status={application.status} />
        </div>
      </div>
    </Card>
  );
}
