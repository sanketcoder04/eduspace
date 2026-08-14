import { Typography, Empty, Tag, Button } from "antd";
import { BookOpen, Plus, Paperclip, Trash2 } from "lucide-react";
import type { SubjectOffering } from "../../types/profile.types";

const { Title, Text } = Typography;

interface SubjectOfferingGridProps {
  offerings: SubjectOffering[];
  isOwner: boolean;
  onAdd?: () => void;
  onRemove?: (id: string) => void;
}

export default function SubjectOfferingGrid({
  offerings,
  isOwner,
  onAdd,
  onRemove,
}: SubjectOfferingGridProps) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-neutral-800 dark:bg-neutral-900 sm:p-6">
      <div className="mb-4 flex items-center justify-between">
        <Title level={5} className="mb-0!">
          Subjects Offered
        </Title>
        {isOwner && (
          <Button size="small" icon={<Plus size={14} />} onClick={onAdd} className="rounded-lg">
            Add
          </Button>
        )}
      </div>

      {offerings.length === 0 ? (
        <Empty description="No subjects added yet" />
      ) : (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {offerings.map((offering) => (
            <div
              key={offering.id}
              className="rounded-xl border border-gray-200 p-4 dark:border-neutral-700"
            >
              <div className="mb-1 flex items-start justify-between">
                <span className="flex items-center gap-2 font-semibold">
                  <BookOpen size={16} className="text-racing-red-500" />
                  {offering.subjectName}
                </span>
                {isOwner && (
                  <button
                    type="button"
                    aria-label="Remove subject"
                    onClick={() => onRemove?.(offering.id)}
                  >
                    <Trash2 size={14} className="text-gray-400 hover:text-racing-red-600" />
                  </button>
                )}
              </div>

              <Text type="secondary" className="block text-sm">
                {offering.qualificationLevel}
              </Text>

              <div className="mt-2 flex flex-wrap items-center gap-2">
                {offering.resumeUrl && (
                  <a
                    href={offering.resumeUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-xs text-racing-red-600 hover:underline"
                  >
                    <Paperclip size={12} /> Resume
                  </a>
                )}
                {offering.certificateUrls.length > 0 && (
                  <Tag>{offering.certificateUrls.length} certificate(s)</Tag>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
