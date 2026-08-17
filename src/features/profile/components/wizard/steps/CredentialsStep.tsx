import { useState } from "react";
import { Input, Button, message, Empty } from "antd";
import { FileText, Award, Plus, Trash2, Paperclip } from "lucide-react";
import FileUpload from "../../shared/FileUpload";
import { useUpdateTeacherResume } from "../../../hooks/useUpdateTeacherResume";
import { useDeleteTeacherResume } from "@/features/profile/hooks/useDeleteTeacherResume";
import type { Certificate } from "../../../types/profile.types";
import { useDeleteTeacherCertificate } from "@/features/profile/hooks/useDeleteTeacherCertificate";
import { useAddTeacherCertificate } from "@/features/profile/hooks/useAddTeacherCertificate";

interface CredentialsStepProps {
  resumeUrl?: string;
  certificates: Certificate[];
}

export default function CredentialsStep({ resumeUrl, certificates }: CredentialsStepProps) {
  const [certTitle, setCertTitle] = useState("");
  const [certUrl, setCertUrl] = useState<string | undefined>();

  const updateResume = useUpdateTeacherResume();
  const deleteResume = useDeleteTeacherResume();
  const addCertificate = useAddTeacherCertificate();
  const deleteCertificate = useDeleteTeacherCertificate();

  const handleAddCertificate = () => {
    if (!certTitle.trim() || !certUrl) {
      message.error("Add a title and upload the certificate file.");
      return;
    }

    addCertificate.mutate(
      { title: certTitle, url: certUrl },
      {
        onSuccess: () => {
          message.success(`Added ${certTitle}`);
          setCertTitle("");
          setCertUrl(undefined);
        },
        onError: () => message.error("Couldn't add that certificate. Please try again."),
      }
    );
  };

  return (
    <div className="mt-6 space-y-6">
      <div>
        <p className="mb-3 flex items-center gap-2 text-sm font-semibold text-gray-500">
          <FileText size={16} className="text-racing-red-500" />
          Resume
        </p>

        <FileUpload
          label="Resume"
          folder="RESUME"
          value={resumeUrl}
          onChange={(url) => {
            if (url === undefined) {
              // remove resume (clear on server) so user can reupload
              deleteResume.mutate(undefined, {
                onSuccess: () => message.success("Resume removed."),
                onError: () => message.error("Couldn't update resume."),
              });
              return;
            }

            if (!url) return;
            updateResume.mutate(url, { onError: () => message.error("Couldn't update resume.") });
          }}
        />
      </div>

      <div>
        <p className="mb-3 flex items-center gap-2 text-sm font-semibold text-gray-500">
          <Award size={16} className="text-racing-red-500" />
          Certificates
        </p>

        {certificates.length > 0 ? (
          <div className="mb-4 space-y-3">
            {certificates.map((certificate) => (
              <div
                key={certificate.id}
                className="flex items-center justify-between rounded-xl border border-gray-200 p-3 dark:border-neutral-700"
              >
                <a
                  href={certificate.url}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2 text-sm font-medium text-racing-red-600 hover:underline"
                >
                  <Paperclip size={14} />
                  {certificate.title}
                </a>
                <button
                  type="button"
                  aria-label="Remove certificate"
                  onClick={() => deleteCertificate.mutate(certificate.id)}
                >
                  <Trash2 size={16} className="text-gray-400 hover:text-racing-red-600" />
                </button>
              </div>
            ))}
          </div>
        ) : (
          <Empty description="No certificates added yet" className="mb-4" />
        )}

        <div className="rounded-xl border border-dashed border-gray-300 p-4 dark:border-neutral-700">
          <div className="flex flex-col gap-0.5">
            <Input
              placeholder="Certificate title, e.g. TEFL Certification"
              value={certTitle}
              onChange={(e) => setCertTitle(e.target.value)}
              className="rounded-xl"
            />
            <FileUpload
              label="Certificate file"
              folder="CERTIFICATE"
              value={certUrl}
              onChange={setCertUrl}
            />
            <Button
              type="dashed"
              block
              icon={<Plus size={16} />}
              loading={addCertificate.isPending}
              onClick={handleAddCertificate}
              className="rounded-xl"
            >
              Add certificate
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
