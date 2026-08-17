import { useState } from "react";
import { Typography, Button, Empty } from "antd";
import { FolderOpen, FolderPen } from "lucide-react";
import type { Certificate } from "../../types/profile.types";
import DocumentsCarousel from "./DocumentsCarousel";
import DocumentLightbox from "./DocumentLightbox";

const { Title } = Typography;

interface CredentialsCardProps {
  resumeUrl?: string;
  certificates: Certificate[];
  isOwner: boolean;
  onManage?: () => void;
}

export default function CredentialsCard({
  resumeUrl,
  certificates,
  isOwner,
  onManage,
}: CredentialsCardProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const items = [
    ...(resumeUrl ? [{ key: "resume", title: "Resume", url: resumeUrl }] : []),
    ...certificates.map((certificate) => ({
      key: certificate.id,
      title: certificate.title,
      url: certificate.url,
    })),
  ];

  if (items.length === 0 && !isOwner) return null;

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-neutral-800 dark:bg-neutral-900 sm:p-6">
      <div className="mb-4 flex items-center justify-between">
        <Title level={5} className="mb-0!">
          Documents
        </Title>
        {isOwner && (
          <Button
            size="small"
            icon={<FolderPen size={14} />}
            onClick={onManage}
            className="rounded-lg"
          >
            Manage
          </Button>
        )}
      </div>

      {items.length === 0 ? (
        <Empty
          description="No documents added yet"
          image={<FolderOpen className="mx-auto text-gray-300" size={40} />}
        />
      ) : (
        <DocumentsCarousel items={items} onSelect={setActiveIndex} />
      )}

      <DocumentLightbox
        items={items}
        activeIndex={activeIndex}
        onClose={() => setActiveIndex(null)}
        onNavigate={setActiveIndex}
      />
    </div>
  );
}
