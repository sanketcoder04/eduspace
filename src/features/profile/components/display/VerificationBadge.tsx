import { Tooltip } from "antd";
import { ShieldAlert, ShieldCheck } from "lucide-react";
import type { VerificationStatus } from "../../types/profile.types";

export default function VerificationBadge({ status }: { status: VerificationStatus }) {
  if (status === "VERIFIED") {
    return (
      <Tooltip title="Identity and location verified">
        <ShieldCheck size={20} className="text-racing-red-500" />
      </Tooltip>
    );
  }

  if (status === "PENDING") {
    return (
      <Tooltip title="Verification in review">
        <ShieldAlert size={14} className="text-amber-500" />
      </Tooltip>
    );
  }

  return null;
}
