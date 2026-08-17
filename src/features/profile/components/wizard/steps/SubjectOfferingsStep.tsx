import { useState } from "react";
import { Input, Button, message, Empty } from "antd";
import { BookOpen, Plus, Trash2 } from "lucide-react";
import { useAddSubjectOffering } from "../../../hooks/useAddSubjectOffering";
import { useDeleteSubjectOffering } from "../../../hooks/useDeleteSubjectOffering";
import type { SubjectOffering } from "../../../types/profile.types";

interface SubjectOfferingsStepProps {
  existingOfferings: SubjectOffering[];
}

export default function SubjectOfferingsStep({ existingOfferings }: SubjectOfferingsStepProps) {
  const [subjectName, setSubjectName] = useState("");
  const [qualificationLevel, setQualificationLevel] = useState("");

  const addMutation = useAddSubjectOffering();
  const deleteMutation = useDeleteSubjectOffering();

  const handleAdd = () => {
    if (!subjectName.trim() || !qualificationLevel.trim()) {
      message.error("Enter both a subject name and qualification level.");
      return;
    }

    addMutation.mutate(
      { subjectName, qualificationLevel },
      {
        onSuccess: () => {
          message.success(`Added ${subjectName}`);
          setSubjectName("");
          setQualificationLevel("");
        },
        onError: () => message.error("Couldn't add that subject. Please try again."),
      }
    );
  };

  return (
    <div>
      <p className="mb-3 flex items-center gap-2 text-sm font-semibold text-gray-500">
        <BookOpen size={16} className="text-racing-red-500" />
        Subjects you teach
      </p>

      {existingOfferings.length > 0 ? (
        <div className="mb-4 space-y-3">
          {existingOfferings.map((offering) => (
            <div
              key={offering.id}
              className="flex items-center justify-between rounded-xl border border-gray-200 p-3 dark:border-neutral-700"
            >
              <div>
                <p className="font-semibold">{offering.subjectName}</p>
                <p className="text-xs text-gray-500">{offering.qualificationLevel}</p>
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
      ) : (
        <Empty description="No subjects added yet" className="mb-4" />
      )}

      <div className="rounded-xl border border-dashed border-gray-300 p-4 dark:border-neutral-700">
        <div className="space-y-3 flex flex-col gap-2">
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
          <Button
            type="dashed"
            block
            icon={<Plus size={16} />}
            loading={addMutation.isPending}
            onClick={handleAdd}
            className="rounded-xl"
          >
            Add Subject
          </Button>
        </div>
      </div>
    </div>
  );
}
