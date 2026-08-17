import { Form, message } from "antd";
import SubjectOfferingsStep from "./SubjectOfferingsStep";
import CredentialsStep from "./CredentialsStep";
import WizardStepFooter from "../../shared/WizardStepFooter";
import type { Certificate, SubjectOffering } from "../../../types/profile.types";

interface SubjectsAndCredentialsStepProps {
  existingOfferings: SubjectOffering[];
  resumeUrl?: string;
  certificates: Certificate[];
  onContinue: () => void;
  onBack: () => void;
}

export default function SubjectsAndCredentialsStep({
  existingOfferings,
  resumeUrl,
  certificates,
  onContinue,
  onBack,
}: SubjectsAndCredentialsStepProps) {
  const handleContinue = () => {
    if (existingOfferings.length === 0) {
      message.error("Add at least one subject you teach before continuing.");
      return;
    }
    onContinue();
  };

  return (
    <Form layout="vertical" requiredMark={false} onFinish={handleContinue}>
      <SubjectOfferingsStep existingOfferings={existingOfferings} />
      <CredentialsStep resumeUrl={resumeUrl} certificates={certificates} />
      <WizardStepFooter onBack={onBack} loading={false} continueLabel="Continue" />
    </Form>
  );
}
