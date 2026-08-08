import { useAuth } from "@/features/auth/hooks/useAuth";
import { useMyTeacherProfile } from "./useMyTeacherProfile";
import { useMyStudentProfile } from "./useMyStudentProfile";

export function useMyProfile() {
  const { auth } = useAuth();
  const role = auth.user?.role;

  const teacherQuery = useMyTeacherProfile(role === "TEACHER");
  const studentQuery = useMyStudentProfile(role === "STUDENT");

  if (role === "TEACHER") {
    return { profile: teacherQuery.data, ...teacherQuery };
  }
  if (role === "STUDENT") {
    return { profile: studentQuery.data, ...studentQuery };
  }
  return { profile: undefined, isLoading: false, isFetched: true, isError: false };
}
