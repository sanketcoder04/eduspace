import { Input, Switch, Select } from "antd";
import { Plus, X } from "lucide-react";
import { MAX_POLL_OPTIONS, POLL_DURATION_OPTIONS } from "../../constants/postOptions";

interface PollBuilderProps {
  options: string[];
  onOptionsChange: (options: string[]) => void;
  allowMultipleChoice: boolean;
  onAllowMultipleChoiceChange: (value: boolean) => void;
  durationDays: number;
  onDurationDaysChange: (days: number) => void;
}

export default function PollBuilder({
  options,
  onOptionsChange,
  allowMultipleChoice,
  onAllowMultipleChoiceChange,
  durationDays,
  onDurationDaysChange,
}: PollBuilderProps) {
  const updateOption = (index: number, value: string) => {
    onOptionsChange(options.map((opt, i) => (i === index ? value : opt)));
  };

  const removeOption = (index: number) => {
    onOptionsChange(options.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-3">
      <div className="space-y-2">
        {options.map((option, index) => (
          <div key={index} className="flex items-center gap-2">
            <Input
              value={option}
              onChange={(e) => updateOption(index, e.target.value)}
              placeholder={`Option ${index + 1}`}
              maxLength={100}
              className="rounded-xl"
            />
            {options.length > 2 && (
              <button type="button" onClick={() => removeOption(index)} aria-label="Remove option">
                <X size={16} className="text-gray-400 hover:text-racing-red-600" />
              </button>
            )}
          </div>
        ))}
      </div>

      {options.length < MAX_POLL_OPTIONS && (
        <button
          type="button"
          onClick={() => onOptionsChange([...options, ""])}
          className="flex items-center gap-1.5 text-sm font-medium text-racing-red-600 hover:underline"
        >
          <Plus size={14} /> Add option
        </button>
      )}

      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-gray-100 pt-3 dark:border-neutral-800">
        <div className="flex items-center gap-2">
          <Switch
            checked={allowMultipleChoice}
            onChange={onAllowMultipleChoiceChange}
            size="small"
          />
          <span className="text-sm text-gray-600 dark:text-gray-300">Allow multiple choices</span>
        </div>

        <Select
          value={durationDays}
          onChange={onDurationDaysChange}
          options={[...POLL_DURATION_OPTIONS]}
          size="small"
          className="w-32"
        />
      </div>
    </div>
  );
}
