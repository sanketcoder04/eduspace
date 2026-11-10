import { useMemo, useState } from "react";
import { Button, Empty, Input, Pagination, Segmented, Skeleton } from "antd";
import { Search } from "lucide-react";
import { useApplicationSearch } from "@/features/application/hooks/useApplicationSearch";
import SentApplicationCard from "@/features/application/components/SentApplicationCard";
import ReceivedApplicationCard from "@/features/application/components/ReceivedApplicationCard";
import {
  ApplicationFilterMobileTrigger,
  ApplicationFilterSidebar,
  type ApplicationFilterState,
} from "@/features/application/components/ApplicationFilterBar";
import { useDebouncedValue } from "@/utils/useDebouncedValue";
import type {
  ApplicationBox,
  ApplicationFilterRequest,
} from "@/features/application/types/application.types";
import { STICKY_PAGE_HEADER_CLASS } from "@/constants/layout";

const MIN_KEYWORD_LENGTH = 2;

const DEFAULT_FILTERS: ApplicationFilterState = {
  statuses: [],
  sort: "NEWEST",
  appliedDays: 0,
};

export default function ApplicationsPage() {
  const [box, setBox] = useState<ApplicationBox>("RECEIVED");
  const [page, setPage] = useState(0);
  const [keyword, setKeyword] = useState("");
  const [filters, setFilters] = useState<ApplicationFilterState>(DEFAULT_FILTERS);

  const debouncedKeyword = useDebouncedValue(keyword, 300).trim();
  const activeKeyword =
    debouncedKeyword.length >= MIN_KEYWORD_LENGTH ? debouncedKeyword : undefined;

  const requestFilter = useMemo<ApplicationFilterRequest>(
    () => ({
      box,
      statuses: filters.statuses.length ? filters.statuses : undefined,
      keyword: activeKeyword,
      postedAfter: filters.appliedSince,
      sort: filters.sort,
    }),
    [box, filters, activeKeyword]
  );

  const { data, isLoading, isFetching } = useApplicationSearch(requestFilter, { page, size: 10 });

  const hasActiveFilters =
    keyword.trim().length > 0 || filters.statuses.length > 0 || filters.appliedDays > 0;

  const handleFiltersChange = (next: ApplicationFilterState) => {
    setFilters(next);
    setPage(0);
  };

  const clearAll = () => {
    setKeyword("");
    setFilters((current) => ({ ...DEFAULT_FILTERS, sort: current.sort }));
    setPage(0);
  };

  const isStale = isFetching && !isLoading;

  return (
    <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-8">
      <div
        className={`${STICKY_PAGE_HEADER_CLASS} mb-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between`}
      >
        <div className="flex items-center justify-between gap-3 sm:justify-start sm:gap-4">
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

        <div className="flex w-full items-center gap-3 sm:w-auto">
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
                ? "Search posting, poster or note"
                : "Search posting, applicant or note"
            }
            aria-label="Search applications"
            maxLength={100}
            className="min-w-0 flex-1 rounded-xl sm:w-72 sm:flex-none [&_input]:text-base sm:[&_input]:text-sm"
          />

          <ApplicationFilterMobileTrigger
            value={filters}
            onChange={handleFiltersChange}
            onClearAll={clearAll}
            hasActiveFilters={hasActiveFilters}
          />
        </div>
      </div>

      <div className="flex flex-col gap-6 lg:flex-row">
        <ApplicationFilterSidebar
          value={filters}
          onChange={handleFiltersChange}
          onClearAll={clearAll}
          hasActiveFilters={hasActiveFilters}
        />

        <div className="min-w-0 flex-1">
          {isLoading && !data ? (
            <div className="space-y-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <div
                  key={i}
                  className="rounded-2xl border border-gray-200 p-5 dark:border-neutral-800"
                >
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
                  <Button onClick={clearAll} className="rounded-xl">
                    Clear search & filters
                  </Button>
                )}
              </Empty>
            </div>
          ) : (
            <div
              className={`flex flex-col gap-4 transition-opacity ${isStale ? "opacity-60" : ""}`}
            >
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
      </div>
    </div>
  );
}
