import { StickyNote } from "lucide-react";

export default function OpportunityAdditionalNotes({ notes }: { notes: string }) {
  return (
    <div className="rounded-2xl border border-gray-200 p-5 dark:border-neutral-800">
      <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-gray-900 dark:text-white">
        <StickyNote size={16} className="text-racing-red-500" />
        Additional Requirements
      </h3>
      <p className="whitespace-pre-line text-sm text-gray-600 dark:text-gray-300">{notes}</p>
    </div>
  );
}
