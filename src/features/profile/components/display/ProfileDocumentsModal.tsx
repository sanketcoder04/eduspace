import { useState } from "react";
import { Modal, Button, Space, Tag, message } from "antd";
import FileUpload from "../shared/FileUpload";
import { useUpdateTeacherResume } from "../../hooks/useUpdateTeacherResume";
import { useUpdateTeacherCertificates } from "../../hooks/useUpdateTeacherCertificates";
import { useUpdateStudentResume } from "../../hooks/useUpdateStudentResume";
import { useUpdateStudentCertificates } from "../../hooks/useUpdateStudentCertificates";
import type { TeacherProfile, StudentProfile } from "../../types/profile.types";

interface Props {
  open: boolean;
  onClose: () => void;
  profile: TeacherProfile | StudentProfile;
  isTeacher: boolean;
}

export default function ProfileDocumentsModal({ open, onClose, profile, isTeacher }: Props) {
  const [resumeUrl, setResumeUrl] = useState<string | undefined>(profile.resumeUrl);
  const [certificateUrls, setCertificateUrls] = useState<string[]>(profile.certificateUrls ?? []);

  const updateTeacherResume = useUpdateTeacherResume();
  const updateTeacherCertificates = useUpdateTeacherCertificates();
  const updateStudentResume = useUpdateStudentResume();
  const updateStudentCertificates = useUpdateStudentCertificates();

  const handleAddCertificate = (url: string | undefined) => {
    if (url) setCertificateUrls((prev) => [...prev, url]);
  };

  const handleRemoveCertificate = (idx: number) => {
    setCertificateUrls((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleSave = async () => {
    try {
      if (isTeacher) {
        if (resumeUrl !== profile.resumeUrl && resumeUrl) {
          await updateTeacherResume.mutateAsync(resumeUrl);
        }
        if (JSON.stringify(certificateUrls) !== JSON.stringify(profile.certificateUrls ?? [])) {
          await updateTeacherCertificates.mutateAsync(certificateUrls);
        }
      } else {
        if (resumeUrl !== profile.resumeUrl && resumeUrl) {
          await updateStudentResume.mutateAsync(resumeUrl);
        }
        if (JSON.stringify(certificateUrls) !== JSON.stringify(profile.certificateUrls ?? [])) {
          await updateStudentCertificates.mutateAsync(certificateUrls);
        }
      }
      message.success("Documents updated.");
      onClose();
    } catch (e) {
      message.error("Couldn't update documents. Please try again.");
    }
  };

  return (
    <Modal open={open} onCancel={onClose} footer={null} title="Manage documents" destroyOnClose>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-semibold">Resume</p>
            <p className="text-sm text-gray-500">Upload a single resume (PDF/image).</p>
          </div>
          <FileUpload label="Resume" folder="RESUME" value={resumeUrl} onChange={setResumeUrl} />
        </div>

        <div>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-semibold">Certificates</p>
              <p className="text-sm text-gray-500">Upload one or more certificates.</p>
            </div>
            <FileUpload
              label="Certificate"
              folder="CERTIFICATE"
              value={undefined}
              onChange={handleAddCertificate}
            />
          </div>

          <div className="mt-3 flex flex-wrap gap-2">
            {certificateUrls.map((url, idx) => (
              <Tag key={idx} closable onClose={() => handleRemoveCertificate(idx)}>
                <a href={url} target="_blank" rel="noreferrer" className="hover:underline">
                  Certificate {idx + 1}
                </a>
              </Tag>
            ))}
          </div>
        </div>

        <div className="mt-4 flex justify-end">
          <Space>
            <Button onClick={onClose}>Cancel</Button>
            <Button
              type="primary"
              onClick={handleSave}
              loading={
                updateTeacherResume.isPending ||
                updateTeacherCertificates.isPending ||
                updateStudentResume.isPending ||
                updateStudentCertificates.isPending
              }
            >
              Save
            </Button>
          </Space>
        </div>
      </div>
    </Modal>
  );
}
