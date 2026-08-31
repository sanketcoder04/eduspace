import { Clock } from "lucide-react";
import type { TeachingOpeningDetails, WeekDay } from "../types/opportunity.types";

const DAY_ORDER: WeekDay[] = [
  "MONDAY",
  "TUESDAY",
  "WEDNESDAY",
  "THURSDAY",
  "FRIDAY",
  "SATURDAY",
  "SUNDAY",
];

const DAY_LABEL: Record<WeekDay, string> = {
  MONDAY: "Monday",
  TUESDAY: "Tuesday",
  WEDNESDAY: "Wednesday",
  THURSDAY: "Thursday",
  FRIDAY: "Friday",
  SATURDAY: "Saturday",
  SUNDAY: "Sunday",
};

interface OpportunitySlotsTableProps {
  details: TeachingOpeningDetails;
}

export default function OpportunitySlotsTable({ details }: OpportunitySlotsTableProps) {
  const slots = details.availableSlots;

  if (!slots || slots.length === 0) return null;

  const byDay = new Map<WeekDay, string[]>();

  slots.forEach((slot) => {
    const existing = byDay.get(slot.day) ?? [];
    existing.push(`${slot.startTime} – ${slot.endTime}`);
    byDay.set(slot.day, existing);
  });

  byDay.forEach((times) => times.sort());

  const orderedDays = DAY_ORDER.filter((day) => byDay.has(day));

  return (
    <div className="rounded-2xl border border-gray-200 p-4 dark:border-neutral-800">
      <h3 className="mb-4 flex items-center gap-2 text-sm font-semibold text-gray-900 dark:text-white">
        <Clock size={16} className="text-racing-red-500" />
        Weekly Schedule
      </h3>

      <div className="grid grid-cols-1 gap-x-6 gap-y-3 sm:grid-cols-2 lg:grid-cols-3">
        {orderedDays.map((day) => (
          <div
            key={day}
            className="flex items-start justify-between gap-1 border-b border-gray-50 pb-2 dark:border-neutral-800"
          >
            <span className="text-sm font-medium text-gray-700 dark:text-gray-200">
              {DAY_LABEL[day]}
            </span>
            <div className="text-right">
              {byDay.get(day)!.map((timeRange) => (
                <p key={timeRange} className="text-sm text-gray-500">
                  {timeRange}
                </p>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
