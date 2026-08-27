import { useQuery } from "@tanstack/react-query";
import { getSentApplications } from "../services/application.service";
import type { PageableParams } from "@/types/api.types";

export function useSentApplications(pageable?: PageableParams) {
  return useQuery({
    queryKey: ["applications", "sent", pageable?.page ?? 0],
    queryFn: () => getSentApplications(pageable),
    placeholderData: (previousData) => previousData,
  });
}
