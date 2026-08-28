import { Button, Select, Input, Empty } from "antd";
import { Controller, type Control, useFieldArray } from "react-hook-form";
import { Plus, Trash2, Clock } from "lucide-react";
import type { TeachingOpeningFormValues } from "@/schemas/opportunity/teachingOpening.schema";

const DAY_OPTIONS = [
  { label: "Monday", value: "MONDAY" },
  { label: "Tuesday", value: "TUESDAY" },
  { label: "Wednesday", value: "WEDNESDAY" },
  { label: "Thursday", value: "THURSDAY" },
  { label: "Friday", value: "FRIDAY" },
  { label: "Saturday", value: "SATURDAY" },
  { label: "Sunday", value: "SUNDAY" },
];

interface TimeSlotFieldsProps {
  control: Control<TeachingOpeningFormValues>;
}

export default function TimeSlotFields({ control }: TimeSlotFieldsProps) {
  const { fields, append, remove } = useFieldArray({ control, name: "availableSlots" });

  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <label className="flex items-center gap-1.5 text-sm font-medium text-gray-700 dark:text-gray-300">
          <Clock size={14} className="text-racing-red-500" />
          Available Slots (optional)
        </label>
      </div>

      {fields.length === 0 && (
        <Empty
          description="No slots added yet"
          className="mb-3"
          image={Empty.PRESENTED_IMAGE_SIMPLE}
        />
      )}

      <div className="space-y-3">
        {fields.map((field, index) => (
          <div
            key={field.id}
            className="flex flex-wrap items-center gap-2 rounded-xl border border-gray-200 p-3 dark:border-neutral-700"
          >
            <Controller
              name={`availableSlots.${index}.day`}
              control={control}
              render={({ field: dayField }) => (
                <Select {...dayField} options={DAY_OPTIONS} className="w-32" placeholder="Day" />
              )}
            />
            <Controller
              name={`availableSlots.${index}.startTime`}
              control={control}
              render={({ field: startField }) => (
                <Input {...startField} placeholder="17:00" className="w-24 rounded-lg" />
              )}
            />
            <span className="text-gray-400">to</span>
            <Controller
              name={`availableSlots.${index}.endTime`}
              control={control}
              render={({ field: endField }) => (
                <Input {...endField} placeholder="18:30" className="w-24 rounded-lg" />
              )}
            />
            <button
              type="button"
              aria-label="Remove slot"
              onClick={() => remove(index)}
              className="ml-auto"
            >
              <Trash2 size={16} className="text-gray-400 hover:text-racing-red-600" />
            </button>
          </div>
        ))}
      </div>

      <Button
        type="dashed"
        block
        icon={<Plus size={16} />}
        className="mt-3 rounded-xl"
        onClick={() => append({ day: "MONDAY", startTime: "17:00", endTime: "18:00" })}
      >
        Add a Slot
      </Button>
    </div>
  );
}
