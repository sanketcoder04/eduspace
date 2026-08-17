import { Typography, Empty } from "antd";
import { GraduationCap, Pencil } from "lucide-react";
import type { Education } from "../../types/profile.types";

const { Title, Text } = Typography;

interface EducationTimelineProps {
  education: Education[];
  isOwner: boolean;
  onEdit?: () => void;
}

export default function EducationTimeline({ education, isOwner, onEdit }: EducationTimelineProps) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-neutral-800 dark:bg-neutral-900 sm:p-6">
      <div className="mb-4 flex items-center justify-between">
        <Title level={5} className="mb-0!">
          Education
        </Title>
        {isOwner && (
          <button type="button" onClick={onEdit} aria-label="Edit education">
            <Pencil size={14} className="text-gray-700 hover:text-racing-red-500 cursor-pointer" />
          </button>
        )}
      </div>

      {education.length === 0 ? (
        <Empty description="No education added yet" />
      ) : (
        <div className="space-y-5">
          {education.map((entry) => (
            <div key={entry.id ?? entry.institution} className="flex gap-3">
              <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-racing-red-50 dark:bg-racing-red-950">
                <GraduationCap size={18} className="text-racing-red-500" />
              </div>
              <div>
                <p className="font-semibold">{entry.institution}</p>
                <Text type="secondary" className="block text-sm font-medium">
                  {entry.degree}
                  {entry.fieldOfStudy ? ` · ${entry.fieldOfStudy}` : ""}
                  {entry.board ? ` · ${entry.board}` : ""}
                </Text>
                <div className="text-sm text-racing-red-500 dark:text-racing-red-400">
                  {entry.startYear} – {entry.endYear ?? "Present"}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
