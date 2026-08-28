import { useState } from "react";
import { Segmented } from "antd";
import { Plus } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "antd";
import {
  OpportunityFilterSidebar,
  OpportunityFilterMobileTrigger,
} from "@/features/opportunity/components/OpportunityFilterBar";
import OpportunityList from "@/features/opportunity/components/OpportunityList";
import { useAuth } from "@/features/auth/hooks/useAuth";
import type {
  OpportunityFilterRequest,
  PostType,
} from "@/features/opportunity/types/opportunity.types";
import { ROUTES } from "@/router/routes";
import { useOpportunitySearch } from "@/features/opportunity/hooks/useOpportunitySearch";

// Static starter list until a "distinct cities in active postings" endpoint
// exists — swap for a real lookup once that's available without touching
// the filter bar component itself.
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

export default function OpportunitiesFeedPage() {
  const { auth } = useAuth();
  const isTeacher = auth.user?.role === "TEACHER";

  // Teachers primarily browse Tuition Requirements (to find students to teach);
  // Students primarily browse Teaching Openings (to find a teacher). Default
  // the tab accordingly, but let either role switch freely.
  const [postType, setPostType] = useState<PostType>(
    isTeacher ? "TUITION_REQUIREMENT" : "TEACHING_OPENING"
  );
  const [filters, setFilters] = useState<OpportunityFilterRequest>({ postType });
  const [page, setPage] = useState(0);

  const handleTabChange = (next: PostType) => {
    setPostType(next);
    setFilters({ postType: next }); // reset filters when switching context
    setPage(0);
  };

  const handleFilterChange = (next: OpportunityFilterRequest) => {
    setFilters(next);
    setPage(0);
  };

  const { data, isLoading, isFetching } = useOpportunitySearch(filters, { page, size: 10 });

  const createHref = isTeacher ? ROUTES.CREATE_TEACHING_OPENING : ROUTES.CREATE_TUITION_REQUIREMENT;

  return (
    <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-8">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <Segmented
          value={postType}
          onChange={(v) => handleTabChange(v as PostType)}
          options={[
            { label: "Teaching Openings", value: "TEACHING_OPENING" },
            { label: "Tuition Requirements", value: "TUITION_REQUIREMENT" },
          ]}
          className="rounded-xl"
        />

        <div className="flex items-center gap-3">
          <OpportunityFilterMobileTrigger
            value={filters}
            onChange={handleFilterChange}
            cityOptions={CITY_OPTIONS}
          />

          <Link to={createHref}>
            <Button type="primary" icon={<Plus size={16} />} className="rounded-xl font-semibold">
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
