import { useQuery } from "@tanstack/react-query";
import { searchApplications } from "../services/application.service";
import type { ApplicationFilterRequest } from "../types/application.types";
import type { PageableParams } from "@/types/api.types";

function filterCacheKey(filter: ApplicationFilterRequest) {
  const normalized: Record<string, unknown> = {};

  Object.entries(filter).forEach(([key, value]) => {
    if (key === "box" || value === undefined || value === null) return;
    normalized[key] = Array.isArray(value) ? [...value].sort() : value;
  });

  return JSON.stringify(normalized, Object.keys(normalized).sort());
}

export function useApplicationSearch(filter: ApplicationFilterRequest, pageable?: PageableParams) {
  return useQuery({
    queryKey: [
      "applications",
      filter.box.toLowerCase(),
      "search",
      filterCacheKey(filter),
      pageable?.page ?? 0,
    ],
    queryFn: () => searchApplications(filter, pageable),
    placeholderData: (previousData) => previousData,
  });
}
