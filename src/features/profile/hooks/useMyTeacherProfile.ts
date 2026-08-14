import { useQuery } from "@tanstack/react-query";
import { getMyTeacherProfile } from "../services/profile.service";

export function useMyTeacherProfile(enabled = true) {
  return useQuery({
    queryKey: ["profile", "teacher", "me"],
    queryFn: getMyTeacherProfile,
    enabled,
    staleTime: 1000 * 60,
  });
}
