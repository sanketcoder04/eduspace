import { useState } from "react";
import { Modal, message } from "antd";
import ProfilePageLayout from "@/layouts/ProfilePageLayout";
import AppLoader from "@/components/ui/AppLoader/AppLoader";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { useMyTeacherProfile } from "@/features/profile/hooks/useMyTeacherProfile";
import { useMyStudentProfile } from "@/features/profile/hooks/useMyStudentProfile";
import { useUpdateTeacherBasicInfo } from "@/features/profile/hooks/useUpdateTeacherBasicInfo";
import { useUpdateStudentBasicInfo } from "@/features/profile/hooks/useUpdateStudentBasicInfo";
import { useUpdateTeacherEducation } from "@/features/profile/hooks/useUpdateTeacherEducation";
import { useUpdateStudentEducation } from "@/features/profile/hooks/useUpdateStudentEducation";
import { useUpdateTeacherAvatar } from "@/features/profile/hooks/useUpdateTeacherAvatar";
import { useUpdateTeacherCover } from "@/features/profile/hooks/useUpdateTeacherCover";
import { useUpdateStudentAvatar } from "@/features/profile/hooks/useUpdateStudentAvatar";
import { useDeleteSubjectOffering } from "@/features/profile/hooks/useDeleteSubjectOffering";
import ProfileHeader from "@/features/profile/components/display/ProfileHeader";
import AboutCard from "@/features/profile/components/display/AboutCard";
import EducationTimeline from "@/features/profile/components/display/EducationTimeline";
import SubjectOfferingGrid from "@/features/profile/components/display/SubjectOfferingGrid";
import BasicInfoCard from "@/features/profile/components/display/BasicInfoCard";
import ActivityStatsCard from "@/features/profile/components/display/ActivityStatsCard";
import TeacherBasicInfoStep from "@/features/profile/components/wizard/steps/TeacherBasicInfoStep";
import StudentBasicInfoStep from "@/features/profile/components/wizard/steps/StudentBasicInfoStep";
import EducationStep from "@/features/profile/components/wizard/steps/EducationStep";
import SubjectOfferingsStep from "@/features/profile/components/wizard/steps/SubjectOfferingsStep";
import { useUpdateStudentCover } from "@/features/profile/hooks/useUpdateStudentCover";
import CredentialsCard from "@/features/profile/components/display/CredentialsCard";
import CredentialsStep from "@/features/profile/components/wizard/steps/CredentialsStep";
import StudentCertificatesStep from "@/features/profile/components/wizard/steps/StudentCertificatesStep";
import { MODAL_BODY_SCROLL_STYLE } from "@/constants/modal";

type EditModal = "basic" | "education" | "subjects" | "credentials" | null;

export default function ProfilePage() {
  const { auth } = useAuth();
  const isTeacher = auth.user?.role === "TEACHER";

  const [editModal, setEditModal] = useState<EditModal>(null);
  const closeModal = () => setEditModal(null);

  const teacherQuery = useMyTeacherProfile(isTeacher);
  const studentQuery = useMyStudentProfile(!isTeacher);

  const updateTeacherBasicInfo = useUpdateTeacherBasicInfo();
  const updateStudentBasicInfo = useUpdateStudentBasicInfo();
  const updateTeacherEducation = useUpdateTeacherEducation();
  const updateStudentEducation = useUpdateStudentEducation();
  const updateTeacherAvatar = useUpdateTeacherAvatar();
  const updateTeacherCover = useUpdateTeacherCover();
  const updateStudentAvatar = useUpdateStudentAvatar();
  const updateStudentCover = useUpdateStudentCover();
  const deleteSubjectOffering = useDeleteSubjectOffering();

  if (isTeacher) {
    const profile = teacherQuery.data;

    if (teacherQuery.isLoading || !profile) {
      return <AppLoader fullscreen text="Loading profile..." />;
    }

    return (
      <div className="bg-mist-50">
        <ProfilePageLayout
          sidebar={
            <>
              <BasicInfoCard
                isOwner
                role="TEACHER"
                email={profile.email}
                phoneNumber={profile.phoneNumber}
                gender={profile.gender}
                createdAt={profile.createdAt}
                updatedAt={profile.updatedAt}
                lastLoginAt={profile.lastLoginAt}
                profileViews={profile.profileViews}
              />
            </>
          }
          recommendations={
            <>
              <ActivityStatsCard />
              <div className="rounded-2xl border border-dashed border-gray-200 mt-5 p-5 text-sm text-gray-400 dark:border-neutral-700">
                Recommended profiles to follow — coming soon.
              </div>
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
            isOwner
            onAvatarChange={(url) =>
              updateTeacherAvatar.mutate(url, {
                onError: () => message.error("Couldn't update profile photo."),
              })
            }
            onCoverChange={(url) =>
              updateTeacherCover.mutate(url, {
                onError: () => message.error("Couldn't update cover photo."),
              })
            }
            onEditProfile={() => setEditModal("basic")}
          />

          <AboutCard about={profile.about} isOwner />

          <EducationTimeline
            education={profile.education}
            isOwner
            onEdit={() => setEditModal("education")}
          />

          <SubjectOfferingGrid
            offerings={profile.subjectOfferings}
            isOwner
            onAdd={() => setEditModal("subjects")}
            onRemove={(id) =>
              deleteSubjectOffering.mutate(id, {
                onError: () => message.error("Couldn't remove that subject."),
              })
            }
          />

          <CredentialsCard
            resumeUrl={profile.resumeUrl}
            certificates={profile.certificates}
            isOwner
            onManage={() => setEditModal("credentials")}
          />
        </ProfilePageLayout>

        <Modal
          open={editModal === "basic"}
          onCancel={closeModal}
          footer={null}
          title="Edit Your Information"
          destroyOnHidden
          centered
          styles={MODAL_BODY_SCROLL_STYLE}
        >
          <TeacherBasicInfoStep
            defaultValues={{
              name: profile.name,
              phoneNumber: profile.phoneNumber,
              address: profile.address,
              gender: profile.gender,
              headline: profile.headline,
              about: profile.about,
            }}
            avatarUrl={profile.avatarUrl}
            coverImageUrl={profile.coverImageUrl}
            loading={updateTeacherBasicInfo.isPending}
            onSubmit={(values) =>
              updateTeacherBasicInfo.mutate(values, {
                onSuccess: () => {
                  message.success("Profile updated.");
                  closeModal();
                },
              })
            }
          />
        </Modal>

        <Modal
          open={editModal === "education"}
          onCancel={closeModal}
          footer={null}
          title="Edit Education"
          destroyOnHidden
          centered
          styles={MODAL_BODY_SCROLL_STYLE}
        >
          <EducationStep
            defaultValues={profile.education}
            loading={updateTeacherEducation.isPending}
            onBack={closeModal}
            isLastStep
            onSubmit={(education) =>
              updateTeacherEducation.mutate(
                { education },
                {
                  onSuccess: () => {
                    message.success("Education updated.");
                    closeModal();
                  },
                }
              )
            }
          />
        </Modal>

        <Modal
          open={editModal === "subjects"}
          onCancel={closeModal}
          footer={null}
          title="Manage Subjects"
          destroyOnHidden
          centered
          styles={MODAL_BODY_SCROLL_STYLE}
        >
          <SubjectOfferingsStep existingOfferings={profile.subjectOfferings} />
        </Modal>

        <Modal
          open={editModal === "credentials"}
          onCancel={closeModal}
          footer={null}
          title="Manage Resume & Certificates"
          destroyOnHidden
          centered
          styles={MODAL_BODY_SCROLL_STYLE}
        >
          <CredentialsStep resumeUrl={profile.resumeUrl} certificates={profile.certificates} />
        </Modal>
      </div>
    );
  }

  const profile = studentQuery.data;

  if (studentQuery.isLoading || !profile) {
    return <AppLoader fullscreen text="Loading profile..." />;
  }

  return (
    <div className="bg-mist-50">
      <ProfilePageLayout
        sidebar={
          <>
            <BasicInfoCard
              isOwner
              role="STUDENT"
              email={profile.email}
              phoneNumber={profile.phoneNumber}
              gender={profile.gender}
              createdAt={profile.createdAt}
              updatedAt={profile.updatedAt}
              lastLoginAt={profile.lastLoginAt}
              profileViews={profile.profileViews}
            />
          </>
        }
        recommendations={
          <>
            <ActivityStatsCard />
            <div className="rounded-2xl border border-dashed border-gray-200 mt-5 p-5 text-sm text-gray-400 dark:border-neutral-700">
              Recommended profiles to follow — coming soon.
            </div>
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
          isOwner
          showCover={true}
          onAvatarChange={(url) =>
            updateStudentAvatar.mutate(url, {
              onError: () => message.error("Couldn't update profile photo."),
            })
          }
          onCoverChange={(url) =>
            updateStudentCover.mutate(url, {
              onError: () => message.error("Couldn't update cover photo."),
            })
          }
          onEditProfile={() => setEditModal("basic")}
        />

        <AboutCard about={profile.about} isOwner />

        <EducationTimeline
          education={profile.education}
          isOwner
          onEdit={() => setEditModal("education")}
        />

        <CredentialsCard
          certificates={profile.certificates}
          isOwner
          onManage={() => setEditModal("credentials")}
        />
      </ProfilePageLayout>

      <Modal
        open={editModal === "basic"}
        onCancel={closeModal}
        footer={null}
        title="Edit Your Information"
        destroyOnHidden
        centered
        styles={MODAL_BODY_SCROLL_STYLE}
      >
        <StudentBasicInfoStep
          defaultValues={{
            name: profile.name,
            phoneNumber: profile.phoneNumber,
            address: profile.address,
            parentName: profile.parentName,
            parentPhoneNumber: profile.parentPhoneNumber,
            parentEmail: profile.parentEmail,
            gender: profile.gender,
            headline: profile.headline,
            about: profile.about,
          }}
          avatarUrl={profile.avatarUrl}
          coverImageUrl={profile.coverImageUrl}
          loading={updateStudentBasicInfo.isPending}
          onSubmit={(values) =>
            updateStudentBasicInfo.mutate(values, {
              onSuccess: () => {
                message.success("Profile updated.");
                closeModal();
              },
            })
          }
        />
      </Modal>

      <Modal
        open={editModal === "education"}
        onCancel={closeModal}
        footer={null}
        title="Edit Education"
        destroyOnHidden
        centered
        styles={MODAL_BODY_SCROLL_STYLE}
      >
        <EducationStep
          defaultValues={profile.education}
          loading={updateStudentEducation.isPending}
          onBack={closeModal}
          isLastStep
          onSubmit={(education) =>
            updateStudentEducation.mutate(
              { education },
              {
                onSuccess: () => {
                  message.success("Education updated.");
                  closeModal();
                },
              }
            )
          }
        />
      </Modal>

      <Modal
        open={editModal === "credentials"}
        onCancel={closeModal}
        footer={null}
        title="Manage Certificates"
        destroyOnHidden
        centered
        styles={MODAL_BODY_SCROLL_STYLE}
      >
        <StudentCertificatesStep certificates={profile.certificates} />
      </Modal>
    </div>
  );
}
