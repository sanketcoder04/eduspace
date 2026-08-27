import { useQuery } from "@tanstack/react-query";
import { getReceivedApplications } from "../services/application.service";
import type { PageableParams } from "@/types/api.types";

export function useReceivedApplications(pageable?: PageableParams) {
  return useQuery({
    queryKey: ["applications", "received", pageable?.page ?? 0],
    queryFn: () => getReceivedApplications(pageable),
    placeholderData: (previousData) => previousData,
  });
}
