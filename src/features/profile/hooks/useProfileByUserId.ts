import { useQuery } from "@tanstack/react-query";
import {
  getUserSummary,
  getTeacherProfileByUserId,
  getStudentProfileByUserId,
} from "../services/profile.service";

export function useProfileByUserId(userId: string | undefined) {
  const summaryQuery = useQuery({
    queryKey: ["users", "summary", userId],
    queryFn: () => getUserSummary(userId as string),
    enabled: !!userId,
  });

  const role = summaryQuery.data?.role;
  const lastLoginAt = summaryQuery.data?.lastLoginAt;

  const teacherQuery = useQuery({
    queryKey: ["profile", "teacher", lastLoginAt, "view", userId],
    queryFn: () => getTeacherProfileByUserId(userId as string),
    enabled: !!userId && role === "TEACHER",
  });

  const studentQuery = useQuery({
    queryKey: ["profile", "student", lastLoginAt, "view", userId],
    queryFn: () => getStudentProfileByUserId(userId as string),
    enabled: !!userId && role === "STUDENT",
  });

  if (role === "TEACHER") {
    return {
      profile: teacherQuery.data,
      role,
      lastLoginAt,
      isLoading: summaryQuery.isLoading || teacherQuery.isLoading,
      isError: teacherQuery.isError,
    };
  }
  if (role === "STUDENT") {
    return {
      profile: studentQuery.data,
      role,
      lastLoginAt,
      isLoading: summaryQuery.isLoading || studentQuery.isLoading,
      isError: studentQuery.isError,
    };
  }

  return {
    profile: undefined,
    role: undefined,
    lastLoginAt: undefined,
    isLoading: summaryQuery.isLoading,
    isError: summaryQuery.isError,
  };
}
