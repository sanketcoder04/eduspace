import { Form, Input, InputNumber, DatePicker, Select, Typography, message } from "antd";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import {
  tuitionRequirementSchema,
  type TuitionRequirementFormValues,
} from "@/schemas/opportunity/tuitionRequirement.schema";
import {
  COMMON_SUBJECTS,
  GRADE_LEVEL_OPTIONS,
  BOARD_OPTIONS,
} from "@/features/opportunity/constants/subjects";
import {
  PREFERRED_TUTOR_GENDER_OPTIONS,
  PREFERRED_TUTOR_EXPERIENCE_OPTIONS,
} from "@/features/opportunity/constants/opportunityOptions";
import FeeRangeFields from "@/features/opportunity/components/FeeRangeFields";
import LocationModeFields from "@/features/opportunity/components/LocationModeFields";
import { useCreateTuitionRequirement } from "@/features/opportunity/hooks/useCreateTuitionRequirement";
import { ROUTES } from "@/router/routes";

const { Title, Text } = Typography;

export default function CreateTuitionRequirementPage() {
  const navigate = useNavigate();
  const createMutation = useCreateTuitionRequirement();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<TuitionRequirementFormValues>({
    resolver: zodResolver(tuitionRequirementSchema),
    defaultValues: {
      title: "",
      subjects: [],
      description: "",
      mode: "ONLINE",
      classFormat: "PERSONALIZED",
      feeRange: { min: 0, max: 0, currency: "INR", unit: "PER_HOUR" },
      preferredTutorGender: "NO_PREFERENCE",
      preferredTutorExperienceLevel: "NO_PREFERENCE",
      numberOfStudents: 1,
    },
  });

  const onSubmit = async (values: TuitionRequirementFormValues) => {
    try {
      await createMutation.mutateAsync(values);
      message.success("Tuition requirement posted.");
      navigate(ROUTES.OPPORTUNITIES);
    } catch (error: any) {
      message.error(
        error?.response?.data?.message ?? "Couldn't post this requirement. Please try again."
      );
    }
  };

  return (
    <div className="mx-auto max-w-2xl px-4 py-6 sm:px-6 sm:py-8">
      <Title level={3} className="mb-1! text-racing-red-500!">
        Post a Tuition Requirement
      </Title>
      <Text type="secondary">Let teachers know what kind of help you're looking for.</Text>

      <Form
        layout="vertical"
        requiredMark={false}
        onFinish={handleSubmit(onSubmit)}
        className="mt-6 space-y-1"
      >
        <Form.Item
          label="Title"
          validateStatus={errors.title ? "error" : ""}
          help={errors.title?.message}
        >
          <Controller
            name="title"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                placeholder="e.g. Need a Math tutor for Class 10 CBSE"
                className="rounded-xl"
              />
            )}
          />
        </Form.Item>

        {/* Students keep free-tagging — no ownership constraint like the teacher's list. */}
        <Form.Item
          label="Subjects"
          validateStatus={errors.subjects ? "error" : ""}
          help={errors.subjects?.message as string | undefined}
        >
          <Controller
            name="subjects"
            control={control}
            render={({ field }) => (
              <Select
                {...field}
                mode="tags"
                allowClear
                placeholder="Which subject(s) do you need help with?"
                options={COMMON_SUBJECTS.map((s) => ({ label: s, value: s }))}
                className="w-full"
              />
            )}
          />
        </Form.Item>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Form.Item label="Grade Level (optional)">
            <Controller
              name="gradeLevel"
              control={control}
              render={({ field }) => (
                <Select
                  {...field}
                  allowClear
                  placeholder="Select grade level"
                  options={GRADE_LEVEL_OPTIONS.map((g) => ({ label: g, value: g }))}
                  className="w-full"
                />
              )}
            />
          </Form.Item>

          <Form.Item label="Board (optional)">
            <Controller
              name="board"
              control={control}
              render={({ field }) => (
                <Select
                  {...field}
                  allowClear
                  placeholder="Select board"
                  options={BOARD_OPTIONS.map((b) => ({ label: b, value: b }))}
                  className="w-full"
                />
              )}
            />
          </Form.Item>
        </div>

        <Form.Item
          label="Description"
          validateStatus={errors.description ? "error" : ""}
          help={errors.description?.message}
        >
          <Controller
            name="description"
            control={control}
            render={({ field }) => (
              <Input.TextArea
                {...field}
                rows={4}
                placeholder="What are you struggling with, what goals do you have, anything a teacher should know..."
                className="rounded-xl"
              />
            )}
          />
        </Form.Item>

        <LocationModeFields control={control} errors={errors} />

        <FeeRangeFields control={control} errors={errors} />
        <p className="-mt-3 text-xs text-gray-400">This is the fee range you're able to offer.</p>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Form.Item label="Session Duration (hours, optional)">
            <Controller
              name="sessionDurationHours"
              control={control}
              render={({ field }) => (
                <InputNumber {...field} min={0.5} step={0.5} className="w-full rounded-xl" />
              )}
            />
          </Form.Item>

          <Form.Item label="Sessions Per Week (optional)">
            <Controller
              name="sessionsPerWeek"
              control={control}
              render={({ field }) => (
                <InputNumber {...field} min={1} className="w-full rounded-xl" />
              )}
            />
          </Form.Item>
        </div>

        <Form.Item label="Preferred Start Date (optional)">
          <Controller
            name="preferredStartDate"
            control={control}
            render={({ field }) => (
              <DatePicker
                className="w-full rounded-xl"
                value={field.value ? dayjs(field.value) : null}
                onChange={(date) => field.onChange(date ? date.toISOString() : undefined)}
              />
            )}
          />
        </Form.Item>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Form.Item label="Preferred Tutor Gender">
            <Controller
              name="preferredTutorGender"
              control={control}
              render={({ field }) => (
                <Select {...field} options={PREFERRED_TUTOR_GENDER_OPTIONS} className="w-full" />
              )}
            />
          </Form.Item>

          <Form.Item label="Tutor Experience Level">
            <Controller
              name="preferredTutorExperienceLevel"
              control={control}
              render={({ field }) => (
                <Select
                  {...field}
                  options={PREFERRED_TUTOR_EXPERIENCE_OPTIONS}
                  className="w-full"
                />
              )}
            />
          </Form.Item>
        </div>

        <Form.Item label="Number of Students">
          <Controller
            name="numberOfStudents"
            control={control}
            render={({ field }) => <InputNumber {...field} min={1} className="w-full rounded-xl" />}
          />
        </Form.Item>

        <Form.Item label="Additional Requirements (optional)">
          <Controller
            name="additionalRequirements"
            control={control}
            render={({ field }) => (
              <Input.TextArea
                {...field}
                rows={3}
                placeholder="e.g. Prefers explanations in Hindi, needs weekend slots only..."
                className="rounded-xl"
              />
            )}
          />
        </Form.Item>

        <button
          type="submit"
          disabled={createMutation.isPending}
          className="mt-4 w-full rounded-xl bg-racing-red-500 py-3 font-semibold text-white transition hover:bg-racing-red-600 disabled:opacity-60"
        >
          {createMutation.isPending ? "Posting..." : "Post Tuition Requirement"}
        </button>
      </Form>
    </div>
  );
}
