import { Form, Typography, Alert } from "antd";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ShieldCheck } from "lucide-react";
import {
  verificationSchema,
  type VerificationFormValues,
} from "@/schemas/profile/verification.schema";
import AddressFields from "../../shared/AddressFields";
import AvatarUpload from "../../shared/AvatarUpload";
import WizardStepFooter from "../../shared/WizardStepFooter";
import type { Address, SubmitVerificationRequest } from "../../../types/profile.types";

const { Text } = Typography;

interface VerificationStepProps {
  defaultAddress?: Address;
  onSubmit: (values: SubmitVerificationRequest) => void;
  onBack: () => void;
  loading: boolean;
  isLastStep?: boolean;
}

// Shared between the Teacher and Student wizards — same selfie + address
// capture, same submit shape, just wired to a different mutation by the
// parent wizard.
export default function VerificationStep({
  defaultAddress,
  onSubmit,
  onBack,
  loading,
  isLastStep,
}: VerificationStepProps) {
  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<VerificationFormValues>({
    resolver: zodResolver(verificationSchema),
    defaultValues: {
      selfieUrl: "",
      address: defaultAddress ?? { line1: "", city: "", state: "", pincode: "", country: "" },
    },
  });

  // useWatch (not the `watch()` function returned by useForm) is the
  // memoization-safe way to subscribe to a single field's value — `watch()`
  // itself is fine to call inside handlers, but calling it during render is
  // exactly what triggers the react-hooks/incompatible-library warning,
  // since React Compiler can't verify a closure returned from another hook
  // is stable across renders. useWatch is a proper hook built for this.
  const selfieUrl = useWatch({ control, name: "selfieUrl" });

  return (
    <Form layout="vertical" requiredMark={false} onFinish={handleSubmit(onSubmit)}>
      <Alert
        type="info"
        showIcon
        icon={<ShieldCheck size={16} />}
        message="Quick identity check"
        description="A selfie and your address help students trust who they're contacting. This takes under a minute."
        className="mb-6 rounded-xl"
      />

      <Form.Item
        label="Take a selfie"
        validateStatus={errors.selfieUrl ? "error" : ""}
        help={errors.selfieUrl?.message}
      >
        <div className="flex justify-center">
          <AvatarUpload
            value={selfieUrl}
            onChange={(url) => setValue("selfieUrl", url, { shouldValidate: true })}
            folder="SELFIE"
            size={120}
          />
        </div>
        <Text type="secondary" className="mt-2 block text-center text-xs">
          On mobile this opens your camera directly.
        </Text>
      </Form.Item>

      <div className="mt-4">
        <p className="mb-3 text-sm font-semibold text-gray-500">Confirm your address</p>
        <AddressFields control={control} errors={errors} />
      </div>

      <WizardStepFooter onBack={onBack} loading={loading} isLastStep={isLastStep} />
    </Form>
  );
}
