import { useQuery } from "@tanstack/react-query";
import { searchOpportunities } from "../services/opportunity.service";
import type { OpportunityFilterRequest } from "../types/opportunity.types";
import type { PageableParams } from "@/types/api.types";

/**
 * Stable, order-independent key for a filter object — two calls with the
 * same filter values (regardless of key insertion order or array order for
 * multi-select fields) must hash identically, or React Query treats them as
 * different queries and never dedupes/caches across re-renders.
 */

function filterCacheKey(filter: OpportunityFilterRequest) {
  const normalized: Record<string, unknown> = {};

  Object.entries(filter).forEach(([key, value]) => {
    if (value === undefined || value === null) return;
    normalized[key] = Array.isArray(value) ? [...value].sort() : value;
  });

  return JSON.stringify(normalized, Object.keys(normalized).sort());
}

export function useOpportunitySearch(filter: OpportunityFilterRequest, pageable?: PageableParams) {
  return useQuery({
    queryKey: ["opportunities", "search", filterCacheKey(filter), pageable?.page ?? 0],
    queryFn: () => searchOpportunities(filter, pageable),
    placeholderData: (previousData) => previousData, // keeps old page visible while the next page loads
    staleTime: 1000 * 30,
  });
}
