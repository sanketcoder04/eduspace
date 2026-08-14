import { Form, Input, Radio, message } from "antd";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { User, Phone } from "lucide-react";
import {
  teacherBasicInfoSchema,
  type TeacherBasicInfoFormValues,
} from "@/schemas/profile/teacherBasicInfo.schema";
import AddressFields from "../../shared/AddressFields";
import AvatarUpload from "../../shared/AvatarUpload";
import WizardStepFooter from "../../shared/WizardStepFooter";
import { useUpdateTeacherAvatar } from "../../../hooks/useUpdateTeacherAvatar";
import { useUpdateTeacherCover } from "../../../hooks/useUpdateTeacherCover";
import type { UpdateTeacherBasicInfoRequest } from "../../../types/profile.types";
import CoverPhotoUpload from "../../shared/CoverPhotoUpload";

interface TeacherBasicInfoStepProps {
  defaultValues?: Partial<TeacherBasicInfoFormValues>;
  avatarUrl?: string;
  coverImageUrl?: string;
  onSubmit: (values: UpdateTeacherBasicInfoRequest) => void;
  loading: boolean;
}

export default function TeacherBasicInfoStep({
  defaultValues,
  avatarUrl,
  coverImageUrl,
  onSubmit,
  loading,
}: TeacherBasicInfoStepProps) {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<TeacherBasicInfoFormValues>({
    resolver: zodResolver(teacherBasicInfoSchema),
    defaultValues: {
      name: "",
      phoneNumber: "",
      address: { line1: "", city: "", state: "", pincode: "", country: "" },
      ...defaultValues,
    },
  });

  // Photos save instantly on upload — separate from the rest of the form,
  // which only saves on "Continue" — since that's the behaviour people
  // expect from a profile photo picker (same as LinkedIn, Instagram, etc.).
  const updateAvatar = useUpdateTeacherAvatar();
  const updateCover = useUpdateTeacherCover();

  return (
    <Form layout="vertical" requiredMark={false} onFinish={handleSubmit(onSubmit)}>
      <div className="-mx-5 -mt-5 mb-6 overflow-hidden rounded-t-2xl sm:-mx-8 sm:-mt-8">
        <CoverPhotoUpload
          value={coverImageUrl}
          isOwner
          heightClassName="h-24 sm:h-32"
          onChange={(url) =>
            updateCover.mutate(url, {
              onError: () => message.error("Couldn't update cover photo."),
            })
          }
        />
        <div className="-mt-10 flex justify-center pb-2">
          <AvatarUpload
            value={avatarUrl}
            size={84}
            onChange={(url) =>
              updateAvatar.mutate(url, {
                onError: () => message.error("Couldn't update profile photo."),
              })
            }
          />
        </div>
      </div>

      <Form.Item
        label="Full name"
        validateStatus={errors.name ? "error" : ""}
        help={errors.name?.message}
      >
        <Controller
          name="name"
          control={control}
          render={({ field }) => (
            <Input
              {...field}
              placeholder="As it should appear on your profile"
              prefix={<User size={16} className="text-gray-400" />}
              className="rounded-xl"
            />
          )}
        />
      </Form.Item>

      <Form.Item
        label="Phone number"
        validateStatus={errors.phoneNumber ? "error" : ""}
        help={errors.phoneNumber?.message}
      >
        <Controller
          name="phoneNumber"
          control={control}
          render={({ field }) => (
            <Input
              {...field}
              placeholder="Your contact number"
              prefix={<Phone size={16} className="text-gray-400" />}
              className="rounded-xl"
            />
          )}
        />
      </Form.Item>

      <Form.Item label="Gender (optional)">
        <Controller
          name="gender"
          control={control}
          render={({ field }) => (
            <Radio.Group {...field} optionType="button" buttonStyle="solid">
              <Radio.Button value="MALE">Male</Radio.Button>
              <Radio.Button value="FEMALE">Female</Radio.Button>
              <Radio.Button value="OTHER">Other</Radio.Button>
            </Radio.Group>
          )}
        />
      </Form.Item>

      <AddressFields control={control} errors={errors} />

      <Form.Item
        label="Headline (optional)"
        className="mt-4"
        help={errors.headline?.message ?? 'e.g. "Mathematics tutor, 8 years experience"'}
      >
        <Controller
          name="headline"
          control={control}
          render={({ field }) => (
            <Input {...field} placeholder="A short line under your name" className="rounded-xl" />
          )}
        />
      </Form.Item>

      <Form.Item label="About (optional)" help={errors.about?.message}>
        <Controller
          name="about"
          control={control}
          render={({ field }) => (
            <Input.TextArea
              {...field}
              rows={4}
              placeholder="Tell students about your teaching style and background"
              className="rounded-xl"
            />
          )}
        />
      </Form.Item>

      <WizardStepFooter isFirstStep loading={loading} />
    </Form>
  );
}
