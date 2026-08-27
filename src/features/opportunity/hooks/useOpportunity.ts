import { useQuery } from "@tanstack/react-query";
import { getOpportunityById } from "../services/opportunity.service";

export function useOpportunity(id: string | undefined) {
  return useQuery({
    queryKey: ["opportunities", "detail", id],
    queryFn: () => getOpportunityById(id as string),
    enabled: !!id,
    staleTime: 1000 * 30,
  });
}
