import { useState } from "react";
import { useNavigate } from "react-router-dom";
import ProfileWizardLayout from "@/layouts/ProfileWizardLayout";
import AppLoader from "@/components/ui/AppLoader/AppLoader";
import { ROUTES } from "@/router/routes";
import { useMyTeacherProfile } from "../../hooks/useMyTeacherProfile";
import { useUpdateTeacherBasicInfo } from "../../hooks/useUpdateTeacherBasicInfo";
import { useUpdateTeacherEducation } from "../../hooks/useUpdateTeacherEducation";
import { useSubmitTeacherVerification } from "../../hooks/useSubmitTeacherVerification";
import TeacherBasicInfoStep from "./steps/TeacherBasicInfoStep";
import EducationStep from "./steps/EducationStep";
import SubjectOfferingsStep from "./steps/SubjectOfferingsStep";
import VerificationStep from "./steps/VerificationStep";
import ReviewStep from "./steps/ReviewStep";

const STEPS = [
  { title: "Basic Info" },
  { title: "Education" },
  { title: "Subjects Offered" },
  { title: "Verification" },
  { title: "Review & Submit" },
];

export default function TeacherProfileWizard() {
  const navigate = useNavigate();
  const { data: profile, isLoading } = useMyTeacherProfile();

  const [step, setStep] = useState(0);

  const basicInfoMutation = useUpdateTeacherBasicInfo();
  const educationMutation = useUpdateTeacherEducation();
  const verificationMutation = useSubmitTeacherVerification();

  if (isLoading || !profile) {
    return <AppLoader fullscreen text="Loading your profile..." />;
  }

  const goNext = () => setStep((s) => Math.min(s + 1, STEPS.length - 1));
  const goBack = () => setStep((s) => Math.max(s - 1, 0));

  return (
    <ProfileWizardLayout
      steps={STEPS}
      currentStep={step}
      subtitle="Set up your teaching profile so students can find and trust you."
    >
      {step === 0 && (
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
          loading={basicInfoMutation.isPending}
          onSubmit={(values) => basicInfoMutation.mutate(values, { onSuccess: goNext })}
        />
      )}

      {step === 1 && (
        <EducationStep
          defaultValues={profile.education}
          loading={educationMutation.isPending}
          onBack={goBack}
          onSubmit={(education) => educationMutation.mutate({ education }, { onSuccess: goNext })}
        />
      )}

      {step === 2 && (
        <SubjectOfferingsStep
          existingOfferings={profile.subjectOfferings}
          onBack={goBack}
          onContinue={goNext}
        />
      )}

      {step === 3 && (
        <VerificationStep
          defaultAddress={profile.address}
          loading={verificationMutation.isPending}
          onBack={goBack}
          isLastStep={false}
          onSubmit={(values) => verificationMutation.mutate(values, { onSuccess: goNext })}
        />
      )}

      {step === 4 && (
        <ReviewStep
          name={profile.name}
          avatarUrl={profile.avatarUrl}
          headline={profile.headline}
          address={profile.address}
          education={profile.education}
          subjectOfferings={profile.subjectOfferings}
          verification={profile.verification}
          completionPercent={profile.profileCompletionPercent}
          onBack={goBack}
          onFinish={() => navigate(ROUTES.PROFILE, { replace: true })}
        />
      )}
    </ProfileWizardLayout>
  );
}
