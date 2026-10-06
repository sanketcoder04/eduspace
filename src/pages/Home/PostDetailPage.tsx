import { useParams } from "react-router-dom";
import { Skeleton, Result } from "antd";
import PostCard from "@/features/post/components/display/PostCard";
import HomeLayout from "@/layouts/HomeLayout";
import SideProfile from "@/features/post/components/SideProfile";
import AppLoader from "@/components/ui/AppLoader/AppLoader";
import { useMyStudentProfile } from "@/features/profile/hooks/useMyStudentProfile";
import { useMyTeacherProfile } from "@/features/profile/hooks/useMyTeacherProfile";
import { useAuth } from "@/features/auth/hooks/useAuth";
import ProfileRecommendationsCard from "@/features/follow/components/ProfileRecommendationsCard";
import { usePost } from "@/features/post/hooks/usePost";

export default function PostDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { data: post, isLoading, isError } = usePost(id);

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
      recommendations={<ProfileRecommendationsCard />}
    >
      {isLoading ? (
        <div className="rounded-2xl border border-gray-200 p-5 dark:border-neutral-800">
          <Skeleton active avatar paragraph={{ rows: 4 }} />
        </div>
      ) : isError || !post ? (
        <div className="py-16">
          <Result status="404" title="Post not found" subTitle="This post may have been removed." />
        </div>
      ) : (
        <PostCard post={post} defaultCommentsOpen />
      )}
    </HomeLayout>
  );
}
