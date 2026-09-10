import { useParams, Navigate } from "react-router-dom";
import { Result } from "antd";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { useProfileByUserId } from "@/features/profile/hooks/useProfileByUserId";
import { useFollowStats } from "@/features/follow/hooks/useFollowStats";
import AppLoader from "@/components/ui/AppLoader/AppLoader";
import ProfilePageLayout from "@/layouts/ProfilePageLayout";
import ProfileHeader from "@/features/profile/components/display/ProfileHeader";
import AboutCard from "@/features/profile/components/display/AboutCard";
import EducationTimeline from "@/features/profile/components/display/EducationTimeline";
import SubjectOfferingGrid from "@/features/profile/components/display/SubjectOfferingGrid";
import BasicInfoCard from "@/features/profile/components/display/BasicInfoCard";
import CredentialsCard from "@/features/profile/components/display/CredentialsCard";
import { ROUTES } from "@/router/routes";
import ActivityStatsCard from "@/features/profile/components/display/ActivityStatsCard";

export default function ProfileByIdPage() {
  const { userId } = useParams<{ userId: string }>();
  const { auth } = useAuth();

  const { profile, role, lastLoginAt, isLoading, isError } = useProfileByUserId(userId);
  const { data: followStats } = useFollowStats(userId);

  // Visiting your own profile-by-id link should land you on the real,
  // editable /profile page instead of a read-only view of yourself.
  if (userId === auth.user?.id) {
    return <Navigate to={ROUTES.PROFILE} replace />;
  }

  if (isLoading) {
    return <AppLoader fullscreen text="Loading profile..." />;
  }

  if (isError || !profile) {
    return (
      <div className="mx-auto max-w-md px-4 py-16">
        <Result status="404" title="Profile not found" subTitle="This profile may not exist." />
      </div>
    );
  }

  const isTeacher = role === "TEACHER";

  return (
    <div className="bg-mist-50">
      <ProfilePageLayout
        sidebar={
          <BasicInfoCard
            isOwner={false}
            role={role}
            gender={profile.gender}
            createdAt={profile.createdAt}
            lastLoginAt={lastLoginAt}
          />
        }
        recommendations={
          <>
            <ActivityStatsCard
              followersCount={followStats?.followersCount}
              followingCount={followStats?.followingCount}
            />
          </>
        }
      >
        <ProfileHeader
          name={profile.name}
          headline={profile.headline}
          avatarUrl={profile.avatarUrl}
          coverImageUrl={profile.coverImageUrl}
          address={profile.address}
          verificationStatus={profile.verification.status}
          isOwner={false}
          showCover
          userId={userId as string}
        />

        {/* <div className="flex justify-end">
          <FollowButton targetUserId={userId as string} />
        </div> */}

        <AboutCard about={profile.about} isOwner={false} />

        <EducationTimeline education={profile.education} isOwner={false} />

        {isTeacher && "subjectOfferings" in profile && (
          <SubjectOfferingGrid offerings={profile.subjectOfferings} isOwner={false} />
        )}

        <CredentialsCard
          resumeUrl={isTeacher && "resumeUrl" in profile ? profile.resumeUrl : undefined}
          certificates={profile.certificates}
          isOwner={false}
        />
      </ProfilePageLayout>
    </div>
  );
}
