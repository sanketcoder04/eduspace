import { Form, Radio } from "antd";
import {
  Controller,
  useWatch,
  type Control,
  type FieldError,
  type FieldErrors,
  type FieldValues,
  type Path,
} from "react-hook-form";
import AddressFields from "@/features/profile/components/shared/AddressFields";
import type { AddressFormValues } from "@/schemas/profile/address.schema";
import {
  MODE_OPTIONS,
  CLASS_FORMAT_OPTIONS,
  TUITION_LOCATION_TYPE_OPTIONS,
} from "../constants/opportunityOptions";
import type { Mode, ClassFormat, TuitionLocationType } from "../types/opportunity.types";

export interface LocationModeFieldValues {
  mode: Mode;
  classFormat: ClassFormat;
  address?: AddressFormValues;
  tuitionLocationType?: TuitionLocationType;
}

interface LocationModeFieldsProps<T extends FieldValues & LocationModeFieldValues> {
  control: Control<T>;
  errors: FieldErrors<T>;
}

/**
 * Shared by both post types — renders Mode, Class Format, and (conditionally,
 * only when mode != ONLINE) the Address block + home-tutor/center-based
 * choice. `address` (not `location`) is the form field name here so
 * AddressFields' hardcoded "address.*" paths work unmodified; each page maps
 * address -> location once when building its API payload.
 */
export default function LocationModeFields<T extends FieldValues & LocationModeFieldValues>({
  control,
  errors,
}: LocationModeFieldsProps<T>) {
  const modeError = errors.mode as FieldError | undefined;
  const classFormatError = errors.classFormat as FieldError | undefined;
  const tuitionLocationTypeError = errors.tuitionLocationType as FieldError | undefined;
  const mode = useWatch({ control, name: "mode" as Path<T> }) as Mode | undefined;
  const showAddress = mode !== undefined && mode !== "ONLINE";

  return (
    <div className="space-y-4">
      <Form.Item label="Mode" validateStatus={modeError ? "error" : ""} help={modeError?.message}>
        <Controller
          name={"mode" as Path<T>}
          control={control}
          render={({ field }) => (
            <Radio.Group
              {...field}
              value={field.value as Mode}
              optionType="button"
              buttonStyle="solid"
              className="w-full"
            >
              {MODE_OPTIONS.map((opt) => (
                <Radio.Button key={opt.value} value={opt.value}>
                  {opt.label}
                </Radio.Button>
              ))}
            </Radio.Group>
          )}
        />
      </Form.Item>

      <Form.Item
        label="Class Format"
        validateStatus={classFormatError ? "error" : ""}
        help={classFormatError?.message}
      >
        <Controller
          name={"classFormat" as Path<T>}
          control={control}
          render={({ field }) => (
            <Radio.Group
              {...field}
              value={field.value as ClassFormat}
              optionType="button"
              buttonStyle="solid"
              className="w-full"
            >
              {CLASS_FORMAT_OPTIONS.map((opt) => (
                <Radio.Button key={opt.value} value={opt.value}>
                  {opt.label}
                </Radio.Button>
              ))}
            </Radio.Group>
          )}
        />
      </Form.Item>

      {showAddress && (
        <>
          <Form.Item
            label="Tuition Location Type"
            validateStatus={tuitionLocationTypeError ? "error" : ""}
            help={tuitionLocationTypeError?.message}
          >
            <Controller
              name={"tuitionLocationType" as Path<T>}
              control={control}
              render={({ field }) => (
                <Radio.Group
                  {...field}
                  value={field.value as TuitionLocationType | undefined}
                  optionType="button"
                  buttonStyle="solid"
                  className="w-full"
                >
                  {TUITION_LOCATION_TYPE_OPTIONS.map((opt) => (
                    <Radio.Button key={opt.value} value={opt.value}>
                      {opt.label}
                    </Radio.Button>
                  ))}
                </Radio.Group>
              )}
            />
          </Form.Item>

          <div className="rounded-xl border border-dashed border-gray-300 p-4 dark:border-neutral-700">
            <p className="mb-3 text-sm font-semibold text-gray-500">Address</p>
            <AddressFields control={control} errors={errors} />
          </div>
        </>
      )}
    </div>
  );
}
