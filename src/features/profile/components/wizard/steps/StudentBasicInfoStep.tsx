import { Form, Input, Radio, message } from "antd";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { User, Phone, Users, Mail } from "lucide-react";
import {
  studentBasicInfoSchema,
  type StudentBasicInfoFormValues,
} from "@/schemas/profile/studentBasicInfo.schema";
import AddressFields from "../../shared/AddressFields";
import AvatarUpload from "../../shared/AvatarUpload";
import WizardStepFooter from "../../shared/WizardStepFooter";
import { useUpdateStudentAvatar } from "../../../hooks/useUpdateStudentAvatar";
import { useUpdateStudentCover } from "../../../hooks/useUpdateStudentCover";
import CoverPhotoUpload from "../../shared/CoverPhotoUpload";
import type { UpdateStudentBasicInfoRequest } from "../../../types/profile.types";

interface StudentBasicInfoStepProps {
  defaultValues?: Partial<StudentBasicInfoFormValues>;
  avatarUrl?: string;
  coverImageUrl?: string;
  onSubmit: (values: UpdateStudentBasicInfoRequest) => void;
  loading: boolean;
}

export default function StudentBasicInfoStep({
  defaultValues,
  avatarUrl,
  coverImageUrl,
  onSubmit,
  loading,
}: StudentBasicInfoStepProps) {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<StudentBasicInfoFormValues>({
    resolver: zodResolver(studentBasicInfoSchema),
    defaultValues: {
      name: "",
      phoneNumber: "",
      address: { line1: "", city: "", state: "", pincode: "", country: "" },
      parentName: "",
      ...defaultValues,
    },
  });

  // Saves instantly on upload, same as the Teacher step — independent of the
  // rest of the form's "Continue" save.
  const updateAvatar = useUpdateStudentAvatar();
  const updateCover = useUpdateStudentCover();

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

      <div className="mt-4 rounded-xl border border-dashed border-gray-300 p-4 dark:border-neutral-700">
        <Form.Item
          label="Parent/Guardian name"
          validateStatus={errors.parentName ? "error" : ""}
          help={errors.parentName?.message}
        >
          <Controller
            name="parentName"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                placeholder="Parent or Guardian's name"
                prefix={<Users size={16} className="text-gray-400" />}
                className="rounded-xl"
              />
            )}
          />
        </Form.Item>

        <Form.Item
          label="Parent/Guardian phone"
          validateStatus={errors.parentPhoneNumber ? "error" : ""}
          help={errors.parentPhoneNumber?.message}
        >
          <Controller
            name="parentPhoneNumber"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                placeholder="Contact number"
                prefix={<Phone size={16} className="text-gray-400" />}
                className="rounded-xl"
              />
            )}
          />
        </Form.Item>

        <Form.Item
          label="Parent/Guardian email"
          validateStatus={errors.parentEmail ? "error" : ""}
          help={errors.parentEmail?.message}
        >
          <Controller
            name="parentEmail"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                placeholder="Email address"
                prefix={<Mail size={16} className="text-gray-400" />}
                className="rounded-xl"
              />
            )}
          />
        </Form.Item>
      </div>

      <Form.Item label="Headline (optional)" className="mt-4">
        <Controller
          name="headline"
          control={control}
          render={({ field }) => (
            <Input
              {...field}
              placeholder='e.g. "Class 10, looking for Physics help"'
              className="rounded-xl"
            />
          )}
        />
      </Form.Item>

      <Form.Item label="About (optional)">
        <Controller
          name="about"
          control={control}
          render={({ field }) => (
            <Input.TextArea
              {...field}
              rows={4}
              placeholder="A little about your learning goals"
              className="rounded-xl"
              showCount
            />
          )}
        />
      </Form.Item>

      <WizardStepFooter isFirstStep loading={loading} />
    </Form>
  );
}
