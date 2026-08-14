import { useAuth } from "@/features/auth/hooks/useAuth";
import TeacherProfileWizard from "@/features/profile/components/wizard/TeacherProfileWizard";
import StudentProfileWizard from "@/features/profile/components/wizard/StudentProfileWizard";

export default function CompleteProfilePage() {
  const { auth } = useAuth();

  if (auth.user?.role === "TEACHER") {
    return <TeacherProfileWizard />;
  }

  return <StudentProfileWizard />;
}
