import { useQuery } from "@tanstack/react-query";
import { getMyStudentProfile } from "../services/profile.service";

export function useMyStudentProfile(enabled = true) {
  return useQuery({
    queryKey: ["profile", "student", "me"],
    queryFn: getMyStudentProfile,
    enabled,
    staleTime: 1000 * 60,
  });
}
