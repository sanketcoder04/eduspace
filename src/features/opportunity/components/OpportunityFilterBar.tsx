import { useState } from "react";
import { Select, Slider, Button, Drawer, Badge } from "antd";
import { SlidersHorizontal, X } from "lucide-react";
import { COMMON_SUBJECTS } from "../constants/subjects";
import {
  MODE_OPTIONS,
  CLASS_FORMAT_OPTIONS,
  DATE_POSTED_OPTIONS,
} from "../constants/opportunityOptions";
import type { OpportunityFilterRequest } from "../types/opportunity.types";

interface OpportunityFilterBarProps {
  value: OpportunityFilterRequest;
  onChange: (next: OpportunityFilterRequest) => void;
  cityOptions: string[];
}

const MAX_FEE = 10000;

function countActiveFilters(value: OpportunityFilterRequest): number {
  return [
    value.cities?.length,
    value.modes?.length,
    value.classFormats?.length,
    value.subjects?.length,
    value.minFee !== undefined || value.maxFee !== undefined ? 1 : 0,
    value.postedAfter ? 1 : 0,
  ].filter(Boolean).length;
}

/** The actual filter controls — rendered once, reused by both the desktop sidebar and the mobile drawer. */
function FilterControls({ value, onChange, cityOptions }: OpportunityFilterBarProps) {
  const setDatePosted = (days: number) => {
    if (days === 0) {
      const { postedAfter: _postedAfter, ...rest } = value;
      onChange(rest);
      return;
    }
    const since = new Date();
    since.setDate(since.getDate() - days);
    onChange({ ...value, postedAfter: since.toISOString() });
  };

  const clearAll = () => onChange({ postType: value.postType });

  const activeFilterCount = countActiveFilters(value);

  return (
    <div className="flex flex-col gap-4">
      <div>
        <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
          Location (City)
        </label>
        <Select
          mode="multiple"
          allowClear
          placeholder="Any city"
          className="w-full"
          value={value.cities ?? []}
          onChange={(cities) => onChange({ ...value, cities: cities.length ? cities : undefined })}
          options={cityOptions.map((city) => ({ label: city, value: city }))}
        />
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
          Mode
        </label>
        <Select
          mode="multiple"
          allowClear
          placeholder="Online or Offline"
          className="w-full"
          value={value.modes ?? []}
          onChange={(modes) => onChange({ ...value, modes: modes.length ? modes : undefined })}
          options={MODE_OPTIONS}
        />
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
          Class Format
        </label>
        <Select
          mode="multiple"
          allowClear
          placeholder="Batch or Personalized"
          className="w-full"
          value={value.classFormats ?? []}
          onChange={(classFormats) =>
            onChange({ ...value, classFormats: classFormats.length ? classFormats : undefined })
          }
          options={CLASS_FORMAT_OPTIONS}
        />
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
          Subjects
        </label>
        <Select
          mode="tags"
          allowClear
          placeholder="Any subject"
          className="w-full"
          value={value.subjects ?? []}
          onChange={(subjects) =>
            onChange({ ...value, subjects: subjects.length ? subjects : undefined })
          }
          options={COMMON_SUBJECTS.map((s) => ({ label: s, value: s }))}
        />
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
          Fees Range
        </label>
        <Slider
          range
          min={0}
          max={MAX_FEE}
          step={100}
          value={[value.minFee ?? 0, value.maxFee ?? MAX_FEE]}
          onChange={(range) => {
            const [min, max] = range as [number, number];
            onChange({
              ...value,
              minFee: min === 0 ? undefined : min,
              maxFee: max === MAX_FEE ? undefined : max,
            });
          }}
          tooltip={{ formatter: (v) => `₹${v}` }}
        />
        <div className="flex justify-between text-xs text-gray-500">
          <span>₹{value.minFee ?? 0}</span>
          <span>₹{value.maxFee ?? MAX_FEE}+</span>
        </div>
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
          Date Posted
        </label>
        <Select
          className="w-full"
          value={value.postedAfter ? undefined : 0}
          placeholder="Any time"
          onChange={setDatePosted}
          options={DATE_POSTED_OPTIONS.map((opt) => ({ label: opt.label, value: opt.value }))}
        />
      </div>

      {activeFilterCount > 0 && (
        <Button icon={<X size={14} />} onClick={clearAll} className="rounded-xl">
          Clear all filters ({activeFilterCount})
        </Button>
      )}
    </div>
  );
}

/** Desktop: sticky left sidebar. */
export function OpportunityFilterSidebar(props: OpportunityFilterBarProps) {
  return (
    <aside className="hidden lg:block lg:sticky lg:top-6 lg:h-fit lg:w-72 lg:shrink-0">
      <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
        <h3 className="mb-4 text-sm font-semibold text-gray-900 dark:text-white">Filters</h3>
        <FilterControls {...props} />
      </div>
    </aside>
  );
}

/** Mobile: trigger button that opens a bottom drawer with the same controls. */
export function OpportunityFilterMobileTrigger(props: OpportunityFilterBarProps) {
  const [open, setOpen] = useState(false);
  const activeFilterCount = countActiveFilters(props.value);

  return (
    <div className="lg:hidden">
      <Badge count={activeFilterCount} size="small">
        <Button
          icon={<SlidersHorizontal size={16} />}
          onClick={() => setOpen(true)}
          className="rounded-xl"
        >
          Filters
        </Button>
      </Badge>

      <Drawer
        title="Filters"
        placement="bottom"
        height="80vh"
        open={open}
        onClose={() => setOpen(false)}
      >
        <FilterControls {...props} />
      </Drawer>
    </div>
  );
}
