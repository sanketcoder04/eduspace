import { useMemo, useState } from "react";
import { Button, Empty, Input, Pagination, Segmented, Select, Skeleton } from "antd";
import { Search, X } from "lucide-react";
import { useApplicationSearch } from "@/features/application/hooks/useApplicationSearch";
import SentApplicationCard from "@/features/application/components/SentApplicationCard";
import ReceivedApplicationCard from "@/features/application/components/ReceivedApplicationCard";
import {
  APPLICATION_SORT_OPTIONS,
  APPLICATION_STATUS_OPTIONS,
  APPLIED_WITHIN_OPTIONS,
} from "@/features/application/constants/applicationOptions";
import type {
  ApplicationBox,
  ApplicationFilterRequest,
  ApplicationSort,
  ApplicationStatus,
} from "@/features/application/types/application.types";
import { useDebouncedValue } from "@/utils/useDebouncedValue";

/** Must match the backend's KEYWORD_MIN_LENGTH. Shorter text is ignored server-side anyway. */
const MIN_KEYWORD_LENGTH = 2;

export default function ApplicationsPage() {
  const [box, setBox] = useState<ApplicationBox>("RECEIVED");
  const [page, setPage] = useState(0);

  const [keyword, setKeyword] = useState("");
  const [statuses, setStatuses] = useState<ApplicationStatus[]>([]);
  const [sort, setSort] = useState<ApplicationSort>("NEWEST");
  const [applied, setApplied] = useState<{ days: number; since?: string }>({ days: 0 });

  const debouncedKeyword = useDebouncedValue(keyword, 300).trim();
  const activeKeyword =
    debouncedKeyword.length >= MIN_KEYWORD_LENGTH ? debouncedKeyword : undefined;

  const filter = useMemo<ApplicationFilterRequest>(
    () => ({
      box,
      statuses: statuses.length ? statuses : undefined,
      keyword: activeKeyword,
      postedAfter: applied.since,
      sort,
    }),
    [box, statuses, activeKeyword, applied.since, sort]
  );

  const { data, isLoading, isFetching } = useApplicationSearch(filter, { page, size: 10 });

  const hasActiveFilters = keyword.trim().length > 0 || statuses.length > 0 || applied.days > 0;

  const handleAppliedChange = (days: number) => {
    if (days === 0) {
      setApplied({ days: 0 });
    } else {
      const since = new Date();
      since.setDate(since.getDate() - days);
      setApplied({ days, since: since.toISOString() });
    }
    setPage(0);
  };

  const clearFilters = () => {
    setKeyword("");
    setStatuses([]);
    setApplied({ days: 0 });
    setPage(0);
  };

  const isStale = isFetching && !isLoading;

  return (
    <div className="mx-auto max-w-3xl px-4 py-6 sm:px-6 sm:py-8">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">Applications</h1>
          {data && (
            <p className="text-xs text-gray-400">
              {data.totalElements} {data.totalElements === 1 ? "application" : "applications"}
              {hasActiveFilters ? " found" : ""}
            </p>
          )}
        </div>
        <Segmented
          value={box}
          onChange={(v) => {
            setBox(v as ApplicationBox);
            setPage(0);
          }}
          options={[
            { label: "Received", value: "RECEIVED" },
            { label: "Sent", value: "SENT" },
          ]}
          className="rounded-md!"
        />
      </div>

      {/* Search on its own full-width row; the filters wrap beneath it. */}
      <div className="mb-5 space-y-3 rounded-2xl border border-gray-200 bg-white p-3 shadow-sm dark:border-neutral-800 dark:bg-neutral-900 sm:p-4">
        <Input
          allowClear
          value={keyword}
          onChange={(event) => {
            setKeyword(event.target.value);
            setPage(0);
          }}
          prefix={<Search size={16} className="text-gray-400" />}
          placeholder={
            box === "SENT"
              ? "Search by posting, poster or your note"
              : "Search by posting, applicant or note"
          }
          aria-label="Search applications"
          maxLength={100}
          // 16px text on mobile stops iOS Safari zooming the page on focus.
          className="rounded-xl [&_input]:text-base sm:[&_input]:text-sm"
        />

        <div className="flex flex-wrap gap-3">
          <Select
            mode="multiple"
            allowClear
            maxTagCount="responsive"
            placeholder="Status"
            value={statuses}
            onChange={(next) => {
              setStatuses(next);
              setPage(0);
            }}
            options={APPLICATION_STATUS_OPTIONS}
            className="min-w-40 flex-1"
          />

          <Select
            value={applied.days}
            onChange={handleAppliedChange}
            options={APPLIED_WITHIN_OPTIONS.map((o) => ({ label: o.label, value: o.value }))}
            className="min-w-36 flex-1"
          />

          <Select
            value={sort}
            onChange={(next) => {
              setSort(next);
              setPage(0);
            }}
            options={APPLICATION_SORT_OPTIONS}
            className="min-w-40 flex-1"
          />

          {hasActiveFilters && (
            <Button icon={<X size={14} />} onClick={clearFilters} className="rounded-xl">
              Clear
            </Button>
          )}
        </div>
      </div>

      {isLoading && !data ? (
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="rounded-2xl border border-gray-200 p-5 dark:border-neutral-800">
              <Skeleton active avatar paragraph={{ rows: 2 }} />
            </div>
          ))}
        </div>
      ) : !data || data.content.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-gray-200 py-16 dark:border-neutral-800">
          <Empty
            description={
              hasActiveFilters
                ? "No applications match your search or filters."
                : box === "SENT"
                  ? "You haven't applied to anything yet."
                  : "No applications received yet."
            }
          >
            {hasActiveFilters && (
              <Button onClick={clearFilters} className="rounded-xl">
                Clear search & filters
              </Button>
            )}
          </Empty>
        </div>
      ) : (
        // Dims while the next search loads, so stale results are clearly stale.
        <div className={`flex flex-col gap-4 transition-opacity ${isStale ? "opacity-60" : ""}`}>
          {box === "SENT"
            ? data.content.map((application) => (
                <SentApplicationCard key={application.id} application={application} />
              ))
            : data.content.map((application) => (
                <ReceivedApplicationCard key={application.id} application={application} />
              ))}

          {data.totalPages > 1 && (
            <div className="flex justify-center pt-4">
              <Pagination
                current={page + 1}
                total={data.totalElements}
                pageSize={data.size}
                onChange={(nextPage) => setPage(nextPage - 1)}
                showSizeChanger={false}
                disabled={isFetching}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
