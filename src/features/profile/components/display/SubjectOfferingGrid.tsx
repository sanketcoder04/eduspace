import { Typography, Empty, Button, Tooltip, Tag } from "antd";
import { BookOpen, CalendarPlus, Plus, Trash2 } from "lucide-react";
import type { SubjectOffering } from "../../types/profile.types";
import { formatDate } from "@/utils/formatDate";

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
              <div className="flex items-start justify-between">
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
                    <Trash2
                      size={14}
                      className="text-gray-400 hover:text-racing-red-600 cursor-pointer"
                    />
                  </button>
                )}
              </div>

              <Text type="secondary" className="block text-sm mb-2">
                {offering.qualificationLevel}
              </Text>

              <Tooltip title={`Added on ${formatDate(offering.addedAt)}`}>
                <Tag className="mt-5 rounded-lg bg-gray-100 px-2 py-0.5 text-xs text-gray-500 dark:bg-neutral-800 dark:text-neutral-400">
                  <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-neutral-500">
                    <CalendarPlus size={12} className="text-racing-red-400" />
                    {offering.addedAt ? formatDate(offering.addedAt) : ""}
                  </div>
                </Tag>
              </Tooltip>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
