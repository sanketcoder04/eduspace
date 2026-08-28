import { Form, Input, InputNumber, Switch, DatePicker, Typography, message } from "antd";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import {
  teachingOpeningSchema,
  type TeachingOpeningFormValues,
} from "@/schemas/opportunity/teachingOpening.schema";
import { GRADE_LEVEL_OPTIONS, BOARD_OPTIONS } from "@/features/opportunity/constants/subjects";
import TeacherSubjectSelect from "@/features/opportunity/components/TeacherSubjectSelect";
import FeeRangeFields from "@/features/opportunity/components/FeeRangeFields";
import LocationModeFields from "@/features/opportunity/components/LocationModeFields";
import TimeSlotFields from "@/features/opportunity/components/TimeSlotFields";
import { useCreateTeachingOpening } from "@/features/opportunity/hooks/useCreateTeachingOpening";
import { ROUTES } from "@/router/routes";
import { Select } from "antd";

const { Title, Text } = Typography;

export default function CreateTeachingOpeningPage() {
  const navigate = useNavigate();
  const createMutation = useCreateTeachingOpening();

  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<TeachingOpeningFormValues>({
    resolver: zodResolver(teachingOpeningSchema),
    defaultValues: {
      title: "",
      subjects: [],
      description: "",
      mode: "ONLINE",
      classFormat: "PERSONALIZED",
      feeRange: { min: 0, max: 0, currency: "INR", unit: "PER_HOUR" },
      freeDemoAvailable: false,
      availableSlots: [],
    },
  });

  const classFormat = watch("classFormat");

  const onSubmit = async (values: TeachingOpeningFormValues) => {
    try {
      await createMutation.mutateAsync({
        ...values,
        preferredStartDate: values.preferredStartDate,
      });
      message.success("Teaching opening posted.");
      navigate(ROUTES.OPPORTUNITIES);
    } catch (error: any) {
      message.error(
        error?.response?.data?.message ?? "Couldn't post this opening. Please try again."
      );
    }
  };

  return (
    <div className="mx-auto max-w-2xl px-4 py-6 sm:px-6 sm:py-8">
      <Title level={3} className="mb-1! text-racing-red-500!">
        Post a Teaching Opening
      </Title>
      <Text type="secondary">Let students know what you're open to teach.</Text>

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
                placeholder="e.g. Physics & Chemistry — Class 11-12"
                className="rounded-xl"
              />
            )}
          />
        </Form.Item>

        {/* Subjects — restricted to the teacher's own profile offerings (Part 3.5) */}
        <Controller
          name="subjects"
          control={control}
          render={({ field }) => (
            <TeacherSubjectSelect
              value={field.value}
              onChange={field.onChange}
              error={errors.subjects?.message as string | undefined}
            />
          )}
        />

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
                placeholder="Teaching style, syllabus coverage, what makes this opening a good fit..."
                className="rounded-xl"
              />
            )}
          />
        </Form.Item>

        <LocationModeFields control={control} errors={errors} />

        <FeeRangeFields control={control} errors={errors} />

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

        {classFormat === "BATCH" && (
          <Form.Item
            label="Batch Capacity"
            validateStatus={errors.batchCapacity ? "error" : ""}
            help={errors.batchCapacity?.message}
          >
            <Controller
              name="batchCapacity"
              control={control}
              render={({ field }) => (
                <InputNumber
                  {...field}
                  min={2}
                  placeholder="Max students in this batch"
                  className="w-full rounded-xl"
                />
              )}
            />
          </Form.Item>
        )}

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

        <TimeSlotFields control={control} />

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Form.Item label="Language of Instruction (optional)">
            <Controller
              name="languageOfInstruction"
              control={control}
              render={({ field }) => (
                <Input {...field} placeholder="e.g. English, Hindi" className="rounded-xl" />
              )}
            />
          </Form.Item>

          <Form.Item label="Your Experience in this Subject (years, optional)">
            <Controller
              name="yearsOfExperienceInSubject"
              control={control}
              render={({ field }) => (
                <InputNumber {...field} min={0} className="w-full rounded-xl" />
              )}
            />
          </Form.Item>
        </div>

        <Form.Item label="Offer a Free Demo Class">
          <Controller
            name="freeDemoAvailable"
            control={control}
            render={({ field }) => <Switch checked={field.value} onChange={field.onChange} />}
          />
        </Form.Item>

        <button
          type="submit"
          disabled={createMutation.isPending}
          className="mt-4 w-full rounded-xl bg-racing-red-500 py-3 font-semibold text-white transition hover:bg-racing-red-600 disabled:opacity-60"
        >
          {createMutation.isPending ? "Posting..." : "Post Teaching Opening"}
        </button>
      </Form>
    </div>
  );
}
