import { useState } from "react";
import { Modal, Input, message, Typography } from "antd";
import { Send } from "lucide-react";
import { useApplyToOpportunity } from "../hooks/useApplyToOpportunity";
import { getErrorMessage } from "@/utils/getErrorMessage";

const { Text } = Typography;

interface ApplyModalProps {
  opportunityId: string;
  opportunityTitle: string;
  open: boolean;
  onClose: () => void;
}

export default function ApplyModal({
  opportunityId,
  opportunityTitle,
  open,
  onClose,
}: ApplyModalProps) {
  const [noteText, setNoteText] = useState("");
  const applyMutation = useApplyToOpportunity();

  const handleApply = async () => {
    try {
      await applyMutation.mutateAsync({
        opportunityId,
        message: noteText.trim() || undefined,
      });
      message.success("Application sent.");
      setNoteText("");
      onClose();
    } catch (error) {
      message.error(getErrorMessage(error, "Couldn't send your application. Please try again."));
    }
  };

  return (
    <Modal
      title="Apply to this posting"
      open={open}
      onCancel={onClose}
      onOk={handleApply}
      okText="Send Application"
      okButtonProps={{ loading: applyMutation.isPending, className: "rounded-xl font-semibold" }}
      cancelButtonProps={{ className: "rounded-xl" }}
      centered
      destroyOnHidden
    >
      <Text type="secondary" className="mb-3 block">
        Applying to:{" "}
        <span className="font-medium text-gray-700 dark:text-gray-300">{opportunityTitle}</span>
      </Text>

      <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
        Add a note (optional)
      </label>
      <Input.TextArea
        rows={4}
        value={noteText}
        onChange={(e) => setNoteText(e.target.value)}
        placeholder="Introduce yourself, mention relevant experience, or ask a quick question..."
        className="rounded-xl"
        maxLength={500}
        showCount
      />

      <p className="mt-5 flex items-center gap-1.5 text-xs text-gray-400">
        <Send size={12} />
        The author will review your profile and respond via in-app notification.
      </p>
    </Modal>
  );
}
