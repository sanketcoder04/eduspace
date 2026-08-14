import { useState } from "react";
import { useNavigate } from "react-router-dom";
import ProfileWizardLayout from "@/layouts/ProfileWizardLayout";
import AppLoader from "@/components/ui/AppLoader/AppLoader";
import { ROUTES } from "@/router/routes";
import { useMyStudentProfile } from "../../hooks/useMyStudentProfile";
import { useUpdateStudentBasicInfo } from "../../hooks/useUpdateStudentBasicInfo";
import { useUpdateStudentEducation } from "../../hooks/useUpdateStudentEducation";
import { useSubmitStudentVerification } from "../../hooks/useSubmitStudentVerification";
import StudentBasicInfoStep from "./steps/StudentBasicInfoStep";
import EducationStep from "./steps/EducationStep";
import VerificationStep from "./steps/VerificationStep";
import ReviewStep from "./steps/ReviewStep";

const STEPS = [
  { title: "Basic Info" },
  { title: "Education" },
  { title: "Verification" },
  { title: "Review & Submit" },
];

export default function StudentProfileWizard() {
  const navigate = useNavigate();
  const { data: profile, isLoading } = useMyStudentProfile();

  const [step, setStep] = useState(0);

  const basicInfoMutation = useUpdateStudentBasicInfo();
  const educationMutation = useUpdateStudentEducation();
  const verificationMutation = useSubmitStudentVerification();

  if (isLoading || !profile) {
    return <AppLoader fullscreen text="Loading your profile..." />;
  }

  const goNext = () => setStep((s) => Math.min(s + 1, STEPS.length - 1));
  const goBack = () => setStep((s) => Math.max(s - 1, 0));

  return (
    <ProfileWizardLayout
      steps={STEPS}
      currentStep={step}
      subtitle="Set up your profile so teachers can get to know you."
    >
      {step === 0 && (
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
        <VerificationStep
          defaultAddress={profile.address}
          loading={verificationMutation.isPending}
          onBack={goBack}
          isLastStep={false}
          onSubmit={(values) => verificationMutation.mutate(values, { onSuccess: goNext })}
        />
      )}

      {step === 3 && (
        <ReviewStep
          name={profile.name}
          avatarUrl={profile.avatarUrl}
          headline={profile.headline}
          address={profile.address}
          education={profile.education}
          verification={profile.verification}
          completionPercent={profile.profileCompletionPercent}
          onBack={goBack}
          onFinish={() => navigate(ROUTES.PROFILE, { replace: true })}
        />
      )}
    </ProfileWizardLayout>
  );
}
