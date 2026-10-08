import { useOpportunitySearch } from "./useOpportunitySearch";
import type { PageableParams } from "@/types/api.types";

/** All of a user's posted opportunities regardless of status — the search
 * endpoint defaults to OPEN/PARTIALLY_FILLED only, so every status must be
 * listed explicitly to see a profile's full posting history (including
 * closed/expired ones), same as how the owner's own "my posts" view works. */
export function useUserOpportunities(userId: string | undefined, pageable?: PageableParams) {
  return useOpportunitySearch(
    {
      authorId: userId,
      statuses: ["OPEN", "PARTIALLY_FILLED", "CLOSED", "EXPIRED"],
    },
    pageable
  );
}
