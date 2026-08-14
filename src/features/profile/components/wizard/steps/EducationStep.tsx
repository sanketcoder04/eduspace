import { Form, Input, InputNumber, Button, Row, Col, Empty } from "antd";
import { Controller, useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { GraduationCap, Plus, Trash2 } from "lucide-react";
import { educationListSchema, type EducationFormValues } from "@/schemas/profile/education.schema";
import WizardStepFooter from "../../shared/WizardStepFooter";
import type { Education } from "../../../types/profile.types";

interface EducationStepProps {
  defaultValues?: Education[];
  onSubmit: (education: Education[]) => void;
  onBack: () => void;
  loading: boolean;
  isLastStep?: boolean;
}

type EducationEntry = EducationFormValues["education"][number];

// startYear is required by the schema (real number, not optional/undefined),
// so the "new blank entry" needs a real value too — defaulting to the
// current year keeps this type-correct without an `as any` escape hatch.
const emptyEntry: EducationEntry = {
  institution: "",
  degree: "",
  fieldOfStudy: "",
  board: "",
  startYear: new Date().getFullYear(),
  endYear: undefined,
};

export default function EducationStep({
  defaultValues,
  onSubmit,
  onBack,
  loading,
  isLastStep,
}: EducationStepProps) {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<EducationFormValues>({
    resolver: zodResolver(educationListSchema),
    defaultValues: {
      education: defaultValues && defaultValues.length > 0 ? defaultValues : [emptyEntry],
    },
  });

  const { fields, append, remove } = useFieldArray({ control, name: "education" });

  return (
    <Form
      layout="vertical"
      requiredMark={false}
      onFinish={handleSubmit((values) => onSubmit(values.education as Education[]))}
    >
      {fields.length === 0 && <Empty description="No education added yet" />}

      <div className="space-y-5">
        {fields.map((field, index) => {
          const entryErrors = errors.education?.[index];

          return (
            <div
              key={field.id}
              className="rounded-xl border border-gray-200 p-4 dark:border-neutral-700"
            >
              <div className="mb-3 flex items-center justify-between">
                <span className="flex items-center gap-2 text-sm font-semibold text-gray-500">
                  <GraduationCap size={16} className="text-racing-red-500" />
                  Education {index + 1}
                </span>
                {fields.length > 1 && (
                  <button type="button" onClick={() => remove(index)} aria-label="Remove entry">
                    <Trash2 size={16} className="text-gray-400 hover:text-racing-red-600" />
                  </button>
                )}
              </div>

              <Form.Item
                label="Institution"
                validateStatus={entryErrors?.institution ? "error" : ""}
                help={entryErrors?.institution?.message}
              >
                <Controller
                  name={`education.${index}.institution`}
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      placeholder="School / college / university"
                      className="rounded-xl"
                    />
                  )}
                />
              </Form.Item>

              <Row gutter={12}>
                <Col xs={24} sm={12}>
                  <Form.Item
                    label="Degree / qualification"
                    validateStatus={entryErrors?.degree ? "error" : ""}
                    help={entryErrors?.degree?.message}
                  >
                    <Controller
                      name={`education.${index}.degree`}
                      control={control}
                      render={({ field }) => (
                        <Input
                          {...field}
                          placeholder="e.g. B.Sc, Class 12"
                          className="rounded-xl"
                        />
                      )}
                    />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12}>
                  <Form.Item label="Field of study (optional)">
                    <Controller
                      name={`education.${index}.fieldOfStudy`}
                      control={control}
                      render={({ field }) => (
                        <Input {...field} placeholder="e.g. Mathematics" className="rounded-xl" />
                      )}
                    />
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={12}>
                <Col xs={24} sm={8}>
                  <Form.Item label="Board (optional)">
                    <Controller
                      name={`education.${index}.board`}
                      control={control}
                      render={({ field }) => (
                        <Input {...field} placeholder="e.g. CBSE" className="rounded-xl" />
                      )}
                    />
                  </Form.Item>
                </Col>
                <Col xs={12} sm={8}>
                  <Form.Item
                    label="Start year"
                    validateStatus={entryErrors?.startYear ? "error" : ""}
                    help={entryErrors?.startYear?.message}
                  >
                    <Controller
                      name={`education.${index}.startYear`}
                      control={control}
                      render={({ field }) => (
                        <InputNumber {...field} placeholder="2018" className="w-full rounded-xl" />
                      )}
                    />
                  </Form.Item>
                </Col>
                <Col xs={12} sm={8}>
                  <Form.Item label="End year" help={entryErrors?.endYear?.message}>
                    <Controller
                      name={`education.${index}.endYear`}
                      control={control}
                      render={({ field }) => (
                        <InputNumber {...field} placeholder="2022" className="w-full rounded-xl" />
                      )}
                    />
                  </Form.Item>
                </Col>
              </Row>
            </div>
          );
        })}
      </div>

      <Button
        type="dashed"
        block
        className="mt-4 rounded-xl"
        icon={<Plus size={16} />}
        onClick={() => append(emptyEntry)}
      >
        Add another education entry
      </Button>

      <WizardStepFooter onBack={onBack} loading={loading} isLastStep={isLastStep} />
    </Form>
  );
}
