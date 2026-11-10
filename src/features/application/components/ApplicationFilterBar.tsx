import { useState } from "react";
import { Badge, Button, Drawer, Select } from "antd";
import { SlidersHorizontal, X } from "lucide-react";
import {
  APPLICATION_SORT_OPTIONS,
  APPLICATION_STATUS_OPTIONS,
  APPLIED_WITHIN_OPTIONS,
} from "../constants/applicationOptions";
import { STICKY_BELOW_PAGE_HEADER_TOP_CLASS } from "@/constants/layout";
import type { ApplicationSort, ApplicationStatus } from "../types/application.types";

export interface ApplicationFilterState {
  statuses: ApplicationStatus[];
  sort: ApplicationSort;
  appliedDays: number;
  appliedSince?: string;
}

interface ApplicationFilterBarProps {
  value: ApplicationFilterState;
  onChange: (next: ApplicationFilterState) => void;
  onClearAll: () => void;
  hasActiveFilters: boolean;
}

function countActiveFilters(value: ApplicationFilterState): number {
  return [value.statuses.length, value.appliedDays > 0 ? 1 : 0].filter(Boolean).length;
}

function FilterControls({
  value,
  onChange,
  onClearAll,
  hasActiveFilters,
}: ApplicationFilterBarProps) {
  const setAppliedWithin = (days: number) => {
    if (days === 0) {
      onChange({ ...value, appliedDays: 0, appliedSince: undefined });
      return;
    }
    const since = new Date();
    since.setDate(since.getDate() - days);
    onChange({ ...value, appliedDays: days, appliedSince: since.toISOString() });
  };

  return (
    <div className="flex flex-col gap-4">
      <div>
        <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
          Status
        </label>
        <Select
          mode="multiple"
          allowClear
          placeholder="Any status"
          className="w-full"
          value={value.statuses}
          onChange={(statuses) => onChange({ ...value, statuses })}
          options={APPLICATION_STATUS_OPTIONS}
        />
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
          Applied within
        </label>
        <Select
          className="w-full"
          value={value.appliedDays}
          onChange={setAppliedWithin}
          options={APPLIED_WITHIN_OPTIONS.map((o) => ({ label: o.label, value: o.value }))}
        />
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
          Sort by
        </label>
        <Select
          className="w-full"
          value={value.sort}
          onChange={(sort) => onChange({ ...value, sort })}
          options={APPLICATION_SORT_OPTIONS}
        />
      </div>

      {hasActiveFilters && (
        <Button icon={<X size={14} />} onClick={onClearAll} className="rounded-xl">
          Clear all filters
        </Button>
      )}
    </div>
  );
}

export function ApplicationFilterSidebar(props: ApplicationFilterBarProps) {
  return (
    <aside
      className={`hidden lg:block lg:h-fit lg:max-h-[calc(100vh-168px)] lg:w-72 lg:shrink-0 lg:overflow-y-auto lg:sticky ${STICKY_BELOW_PAGE_HEADER_TOP_CLASS}`}
    >
      <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
        <h3 className="mb-4 text-sm font-semibold text-gray-900 dark:text-white">Filters</h3>
        <FilterControls {...props} />
      </div>
    </aside>
  );
}

export function ApplicationFilterMobileTrigger(props: ApplicationFilterBarProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className="lg:hidden">
      <Badge count={countActiveFilters(props.value)} size="small">
        <Button
          aria-label="Open filters"
          icon={<SlidersHorizontal size={16} />}
          onClick={() => setOpen(true)}
          className="rounded-xl"
        />
      </Badge>

      <Drawer
        title="Filters"
        placement="bottom"
        height="70vh"
        open={open}
        onClose={() => setOpen(false)}
      >
        <FilterControls {...props} />
      </Drawer>
    </div>
  );
}
