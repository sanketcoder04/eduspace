import { Pagination, Empty, Skeleton } from "antd";
import OpportunityCard from "./OpportunityCard";
import type { Page } from "@/types/api.types";
import type { OpportunityResponse } from "../types/opportunity.types";

interface OpportunityListProps {
  page: Page<OpportunityResponse> | undefined;
  isLoading: boolean;
  currentPage: number;
  onPageChange: (page: number) => void;
  emptyMessage?: string;
}

export default function OpportunityList({
  page,
  isLoading,
  currentPage,
  onPageChange,
  emptyMessage = "No postings match your filters yet.",
}: OpportunityListProps) {
  if (isLoading && !page) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="rounded-2xl border border-gray-200 p-5 dark:border-neutral-800">
            <Skeleton active avatar paragraph={{ rows: 3 }} />
          </div>
        ))}
      </div>
    );
  }

  if (!page || page.content.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-gray-200 py-16 dark:border-neutral-800">
        <Empty description={emptyMessage} />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {page.content.map((opportunity) => (
        <OpportunityCard key={opportunity.id} opportunity={opportunity} />
      ))}

      {page.totalPages > 1 && (
        <div className="flex justify-center pt-4">
          <Pagination
            current={currentPage + 1}
            total={page.totalElements}
            pageSize={page.size}
            onChange={(nextPage) => onPageChange(nextPage - 1)}
            showSizeChanger={false}
          />
        </div>
      )}
    </div>
  );
}
