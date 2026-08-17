import { Modal, Typography } from "antd";
import { ChevronLeft, ChevronRight, ExternalLink } from "lucide-react";
import DocumentPreview from "./DocumentPreview";
import type { DocumentItem } from "./DocumentsCarousel";

const { Title } = Typography;

interface DocumentLightboxProps {
  items: DocumentItem[];
  activeIndex: number | null;
  onClose: () => void;
  onNavigate: (index: number) => void;
}

export default function DocumentLightbox({
  items,
  activeIndex,
  onClose,
  onNavigate,
}: DocumentLightboxProps) {
  if (activeIndex === null) return null;

  const item = items[activeIndex];
  if (!item) return null;

  const hasPrev = activeIndex > 0;
  const hasNext = activeIndex < items.length - 1;

  return (
    <Modal open onCancel={onClose} footer={null} width={720} centered destroyOnClose>
      <div className="mb-3 flex items-center justify-between pr-6">
        <Title level={5} className="mb-0!">
          {item.title}
        </Title>
        <a
          href={item.url}
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-1 text-sm text-racing-red-600 hover:underline"
        >
          <ExternalLink size={14} /> Open in new tab
        </a>
      </div>

      <div className="relative h-[70vh] overflow-hidden rounded-xl border border-gray-200 bg-gray-50 dark:border-neutral-700 dark:bg-neutral-800">
        <DocumentPreview url={item.url} />

        {hasPrev && (
          <button
            type="button"
            aria-label="Previous document"
            onClick={() => onNavigate(activeIndex - 1)}
            className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-black/50 p-2 text-white hover:bg-black/70"
          >
            <ChevronLeft size={18} />
          </button>
        )}

        {hasNext && (
          <button
            type="button"
            aria-label="Next document"
            onClick={() => onNavigate(activeIndex + 1)}
            className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-black/50 p-2 text-white hover:bg-black/70"
          >
            <ChevronRight size={18} />
          </button>
        )}
      </div>
    </Modal>
  );
}
