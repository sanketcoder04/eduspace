import { useState } from "react";
import { Form, Input, Button, message, Tag, Empty } from "antd";
import { BookOpen, Plus, Trash2 } from "lucide-react";
import FileUpload from "../../shared/FileUpload";
import WizardStepFooter from "../../shared/WizardStepFooter";
import { useAddSubjectOffering } from "../../../hooks/useAddSubjectOffering";
import { useDeleteSubjectOffering } from "../../../hooks/useDeleteSubjectOffering";
import type { SubjectOffering } from "../../../types/profile.types";

interface SubjectOfferingsStepProps {
  existingOfferings: SubjectOffering[];
  onContinue: () => void;
  onBack: () => void;
}

// Subjects are added one at a time against their own endpoint (teachers keep
// adding these long after onboarding), so this step manages its own local
// draft rather than batching everything into one form submit.
export default function SubjectOfferingsStep({
  existingOfferings,
  onContinue,
  onBack,
}: SubjectOfferingsStepProps) {
  const [subjectName, setSubjectName] = useState("");
  const [qualificationLevel, setQualificationLevel] = useState("");
  const [resumeUrl, setResumeUrl] = useState<string | undefined>();
  const [certificateUrls, setCertificateUrls] = useState<string[]>([]);

  const addMutation = useAddSubjectOffering();
  const deleteMutation = useDeleteSubjectOffering();

  const resetDraft = () => {
    setSubjectName("");
    setQualificationLevel("");
    setResumeUrl(undefined);
    setCertificateUrls([]);
  };

  const handleAdd = () => {
    if (!subjectName.trim() || !qualificationLevel.trim()) {
      message.error("Enter both a subject name and qualification level.");
      return;
    }

    addMutation.mutate(
      { subjectName, qualificationLevel, resumeUrl, certificateUrls },
      {
        onSuccess: () => {
          message.success(`Added ${subjectName}`);
          resetDraft();
        },
        onError: () => message.error("Couldn't add that subject. Please try again."),
      }
    );
  };

  const handleAddCertificate = (url: string | undefined) => {
    if (url) setCertificateUrls((prev) => [...prev, url]);
  };

  const handleContinue = () => {
    if (existingOfferings.length === 0) {
      message.error("Add at least one subject you teach before continuing.");
      return;
    }
    onContinue();
  };

  return (
    <Form layout="vertical" requiredMark={false} onFinish={handleContinue}>
      {existingOfferings.length > 0 && (
        <div className="mb-6 space-y-3">
          {existingOfferings.map((offering) => (
            <div
              key={offering.id}
              className="flex items-center justify-between rounded-xl border border-gray-200 p-3 dark:border-neutral-700"
            >
              <div>
                <p className="font-semibold">{offering.subjectName}</p>
                <p className="text-xs text-gray-500">{offering.qualificationLevel}</p>
                {offering.certificateUrls.length > 0 && (
                  <Tag className="mt-1">{offering.certificateUrls.length} certificate(s)</Tag>
                )}
              </div>
              <button
                type="button"
                aria-label="Remove subject"
                onClick={() => deleteMutation.mutate(offering.id)}
              >
                <Trash2 size={16} className="text-gray-400 hover:text-racing-red-600" />
              </button>
            </div>
          ))}
        </div>
      )}

      {existingOfferings.length === 0 && (
        <Empty description="No subjects added yet" className="mb-6" />
      )}

      <div className="rounded-xl border border-dashed border-gray-300 p-4 dark:border-neutral-700">
        <p className="mb-3 flex items-center gap-2 text-sm font-semibold text-gray-500">
          <BookOpen size={16} className="text-racing-red-500" />
          Add a subject you teach
        </p>

        <div className="space-y-3">
          <Input
            placeholder="Subject name, e.g. Mathematics"
            value={subjectName}
            onChange={(e) => setSubjectName(e.target.value)}
            className="rounded-xl"
          />
          <Input
            placeholder="Qualification level, e.g. Grade 9-12, B.Sc"
            value={qualificationLevel}
            onChange={(e) => setQualificationLevel(e.target.value)}
            className="rounded-xl"
          />

          <div className="flex flex-wrap gap-2">
            <FileUpload label="Resume" folder="RESUME" value={resumeUrl} onChange={setResumeUrl} />
            <FileUpload
              label="Certificate"
              folder="CERTIFICATE"
              value={undefined}
              onChange={handleAddCertificate}
            />
          </div>

          {certificateUrls.length > 0 && (
            <p className="text-xs text-gray-500">
              {certificateUrls.length} certificate(s) attached
            </p>
          )}

          <Button
            type="dashed"
            block
            icon={<Plus size={16} />}
            loading={addMutation.isPending}
            onClick={handleAdd}
            className="rounded-xl"
          >
            Add subject
          </Button>
        </div>
      </div>

      <WizardStepFooter onBack={onBack} loading={false} continueLabel="Continue" />
    </Form>
  );
}
