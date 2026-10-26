import AppLoader from "@/components/ui/AppLoader/AppLoader";
import { useAuth } from "@/features/auth/hooks/useAuth";
import SideProfile from "@/features/post/components/SideProfile";
import PostComposerTrigger from "@/features/post/components/composer/PostComposerTrigger";
import PostFeedList from "@/features/post/components/PostFeedList";
import { useMyStudentProfile } from "@/features/profile/hooks/useMyStudentProfile";
import { useMyTeacherProfile } from "@/features/profile/hooks/useMyTeacherProfile";
import HomeLayout from "@/layouts/HomeLayout";
import ProfileRecommendationsCard from "@/features/follow/components/ProfileRecommendationsCard";
import UserSearchBar from "@/features/search/components/UserSearchBar";

export default function HomePage() {
  const { auth } = useAuth();
  const isTeacher = auth.user?.role === "TEACHER";

  const teacherQuery = useMyTeacherProfile(isTeacher);
  const studentQuery = useMyStudentProfile(!isTeacher);

  const profile = isTeacher ? teacherQuery.data : studentQuery.data;

  if (teacherQuery.isLoading || !profile) {
    return <AppLoader fullscreen text="Loading profile..." />;
  }

  return (
    <HomeLayout
      sideprofile={
        <SideProfile
          name={profile.name}
          headline={profile.headline}
          about={profile.about}
          avatarUrl={profile.avatarUrl}
          coverImageUrl={profile.coverImageUrl}
          address={profile.address}
          verificationStatus={profile.verification.status}
          isOwner
        />
      }
      recommendations={
        <div className="space-y-4">
          {/* Desktop placement: above the recommended profiles */}
          <div className="hidden lg:block">
            <UserSearchBar />
          </div>
          <ProfileRecommendationsCard />
        </div>
      }
    >
      <div className="mx-auto max-w-2xl sm:pt-0 sm:py-8">
        <div className="mb-4 lg:hidden">
          <UserSearchBar />
        </div>

        <div className="mb-4">
          <PostComposerTrigger />
        </div>

        <PostFeedList />
      </div>
    </HomeLayout>
  );
}
