import { Button } from "antd";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";

interface WizardStepFooterProps {
  onBack?: () => void;
  isFirstStep?: boolean;
  isLastStep?: boolean;
  loading?: boolean;
  continueLabel?: string;
}

export default function WizardStepFooter({
  onBack,
  isFirstStep,
  isLastStep,
  loading,
  continueLabel,
}: WizardStepFooterProps) {
  return (
    <div className="mt-8 flex items-center justify-between gap-3">
      {!isFirstStep ? (
        <Button onClick={onBack} icon={<ArrowLeft size={16} />} className="rounded-xl">
          Back
        </Button>
      ) : (
        <span />
      )}

      <Button
        htmlType="submit"
        type="primary"
        loading={loading}
        className="rounded-xl font-semibold"
        icon={isLastStep ? <Check size={16} /> : <ArrowRight size={16} />}
        iconPosition="end"
      >
        {continueLabel ?? (isLastStep ? "Finish" : "Continue")}
      </Button>
    </div>
  );
}
