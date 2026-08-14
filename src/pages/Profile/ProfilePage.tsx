import { useState } from "react";
import { Modal, message } from "antd";
import MainLayout from "@/layouts/MainLayout";
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
import { useDeleteSubjectOffering } from "@/features/profile/hooks/useDeleteSubjectOffering";
import { useUpdateStudentCover } from "@/features/profile/hooks/useUpdateStudentCover";
import ProfileHeader from "@/features/profile/components/display/ProfileHeader";
import AboutCard from "@/features/profile/components/display/AboutCard";
import EducationTimeline from "@/features/profile/components/display/EducationTimeline";
import SubjectOfferingGrid from "@/features/profile/components/display/SubjectOfferingGrid";
import TeacherBasicInfoStep from "@/features/profile/components/wizard/steps/TeacherBasicInfoStep";
import StudentBasicInfoStep from "@/features/profile/components/wizard/steps/StudentBasicInfoStep";
import EducationStep from "@/features/profile/components/wizard/steps/EducationStep";
import SubjectOfferingsStep from "@/features/profile/components/wizard/steps/SubjectOfferingsStep";
import { useUpdateStudentAvatar } from "@/features/profile/hooks/useUpdateStudentAvatar";

type EditModal = "basic" | "education" | "subjects" | null;

// LinkedIn-style read view. Branches into two fully-separate render paths
// (teacher vs student) rather than merging TeacherProfile | StudentProfile
// into one variable — keeps everything properly typed with no `any` casts.
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
      <MainLayout>
        <div className="mx-auto max-w-3xl space-y-4 px-4 py-6 sm:px-6 sm:py-8">
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
        </div>

        <Modal
          open={editModal === "basic"}
          onCancel={closeModal}
          footer={null}
          title="Edit basic info"
          destroyOnClose
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
          title="Edit education"
          destroyOnClose
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
          title="Manage subjects offered"
          destroyOnClose
        >
          <SubjectOfferingsStep
            existingOfferings={profile.subjectOfferings}
            onBack={closeModal}
            onContinue={closeModal}
          />
        </Modal>
      </MainLayout>
    );
  }

  const profile = studentQuery.data;

  if (studentQuery.isLoading || !profile) {
    return <AppLoader fullscreen text="Loading profile..." />;
  }

  return (
    <MainLayout>
      <div className="mx-auto max-w-3xl space-y-4 px-4 py-6 sm:px-6 sm:py-8">
        <ProfileHeader
          name={profile.name}
          headline={profile.headline}
          avatarUrl={profile.avatarUrl}
          address={profile.address}
          coverImageUrl={profile.coverImageUrl}
          verificationStatus={profile.verification.status}
          isOwner
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
      </div>

      <Modal
        open={editModal === "basic"}
        onCancel={closeModal}
        footer={null}
        title="Edit basic info"
        destroyOnClose
      >
        <StudentBasicInfoStep
          defaultValues={{
            name: profile.name,
            phoneNumber: profile.phoneNumber,
            address: profile.address,
            parentName: profile.parentName,
            parentPhoneNumber: profile.parentPhoneNumber,
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
        title="Edit education"
        destroyOnClose
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
    </MainLayout>
  );
}
