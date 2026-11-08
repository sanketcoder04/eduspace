import { useMemo, useState } from "react";
import { Input, Segmented } from "antd";
import { Plus, Search } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "antd";
import {
  OpportunityFilterSidebar,
  OpportunityFilterMobileTrigger,
} from "@/features/opportunity/components/OpportunityFilterBar";
import OpportunityList from "@/features/opportunity/components/OpportunityList";
import { useOpportunitySearch } from "@/features/opportunity/hooks/useOpportunitySearch";
import { useAuth } from "@/features/auth/hooks/useAuth";
import type {
  OpportunityFilterRequest,
  PostType,
} from "@/features/opportunity/types/opportunity.types";
import { ROUTES } from "@/router/routes";
import { useDebouncedValue } from "@/utils/useDebouncedValue";

const CITY_OPTIONS = [
  "Mumbai",
  "Delhi",
  "Bengaluru",
  "Hyderabad",
  "Chennai",
  "Kolkata",
  "Pune",
  "Ahmedabad",
];

const MIN_KEYWORD_LENGTH = 2;

export default function OpportunitiesFeedPage() {
  const { auth } = useAuth();
  const isTeacher = auth.user?.role === "TEACHER";

  const [postType, setPostType] = useState<PostType>(
    isTeacher ? "TUITION_REQUIREMENT" : "TEACHING_OPENING"
  );
  const [filters, setFilters] = useState<OpportunityFilterRequest>({ postType });
  const [page, setPage] = useState(0);

  const [keyword, setKeyword] = useState("");
  const debouncedKeyword = useDebouncedValue(keyword, 300).trim();
  const activeKeyword =
    debouncedKeyword.length >= MIN_KEYWORD_LENGTH ? debouncedKeyword : undefined;

  const queryFilters = useMemo<OpportunityFilterRequest>(
    () => ({ ...filters, keyword: activeKeyword }),
    [filters, activeKeyword]
  );

  const handleTabChange = (next: PostType) => {
    setPostType(next);
    setFilters({ postType: next });
    setPage(0);
  };

  const handleFilterChange = (next: OpportunityFilterRequest) => {
    setFilters(next);
    setPage(0);
  };

  const handleKeywordChange = (value: string) => {
    setKeyword(value);
    setPage(0);
  };

  const { data, isLoading, isFetching } = useOpportunitySearch(queryFilters, { page, size: 10 });

  const createHref = isTeacher ? ROUTES.CREATE_TEACHING_OPENING : ROUTES.CREATE_TUITION_REQUIREMENT;

  return (
    <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-8">
      {/* Header — deliberately two independent rows on mobile (tabs, then
          actions) rather than one row that overflows. The Segmented itself
          sits in an overflow-x-auto wrapper as a last-resort escape hatch:
          if labels are ever too wide for the viewport, THIS scrolls, not
          the whole page. */}
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="overflow-x-auto">
          <Segmented
            value={postType}
            onChange={(v) => handleTabChange(v as PostType)}
            options={[
              {
                label: (
                  <>
                    <span className="sm:hidden">Openings</span>
                    <span className="hidden sm:inline">Teaching Openings</span>
                  </>
                ),
                value: "TEACHING_OPENING",
              },
              {
                label: (
                  <>
                    <span className="sm:hidden">Requirements</span>
                    <span className="hidden sm:inline">Tuition Requirements</span>
                  </>
                ),
                value: "TUITION_REQUIREMENT",
              },
            ]}
            className="rounded-md!"
          />
        </div>

        <div className="flex w-full flex-wrap items-center gap-3 sm:w-auto sm:flex-nowrap">
          <Input
            allowClear
            value={keyword}
            onChange={(event) => handleKeywordChange(event.target.value)}
            prefix={<Search size={16} className="text-gray-400" />}
            placeholder="Search by keyword"
            aria-label="Search postings by keyword"
            maxLength={100}
            className="order-first w-full rounded-xl sm:order-none sm:w-64 [&_input]:text-base sm:[&_input]:text-sm"
          />

          <OpportunityFilterMobileTrigger
            value={filters}
            onChange={handleFilterChange}
            cityOptions={CITY_OPTIONS}
          />

          <Link to={createHref}>
            <Button
              type="primary"
              icon={<Plus size={16} />}
              className="rounded-xl font-semibold whitespace-nowrap"
            >
              {isTeacher ? "Post an Opening" : "Post a Requirement"}
            </Button>
          </Link>
        </div>
      </div>

      <div className="flex flex-col gap-6 lg:flex-row">
        <OpportunityFilterSidebar
          value={filters}
          onChange={handleFilterChange}
          cityOptions={CITY_OPTIONS}
        />

        <div className="min-w-0 flex-1">
          <OpportunityList
            page={data}
            isLoading={isLoading || isFetching}
            currentPage={page}
            onPageChange={setPage}
            emptyMessage={
              postType === "TEACHING_OPENING"
                ? "No teaching openings match your filters yet."
                : "No tuition requirements match your filters yet."
            }
          />
        </div>
      </div>
    </div>
  );
}
