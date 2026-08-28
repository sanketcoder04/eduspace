import { Form, Radio } from "antd";
import { Controller, type Control, type FieldErrors, useWatch } from "react-hook-form";
import AddressFields from "@/features/profile/components/shared/AddressFields";
import {
  MODE_OPTIONS,
  CLASS_FORMAT_OPTIONS,
  TUITION_LOCATION_TYPE_OPTIONS,
} from "../constants/opportunityOptions";

interface LocationModeFieldsProps {
  control: Control<any>;
  errors: FieldErrors<any>;
}

/**
 * Shared by both post types — renders Mode, Class Format, and (conditionally,
 * only when mode != ONLINE) the Address block + home-tutor/center-based
 * choice. Conditional rendering here mirrors the same rule enforced by
 * locationMode.schema.ts and the backend's validateLocation.
 */
export default function LocationModeFields({ control, errors }: LocationModeFieldsProps) {
  const mode = useWatch({ control, name: "mode" });
  const showLocation = mode && mode !== "ONLINE";

  return (
    <div className="space-y-4">
      <Form.Item
        label="Mode"
        validateStatus={errors.mode ? "error" : ""}
        help={errors.mode?.message as string | undefined}
      >
        <Controller
          name="mode"
          control={control}
          render={({ field }) => (
            <Radio.Group {...field} optionType="button" buttonStyle="solid" className="w-full">
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
        validateStatus={errors.classFormat ? "error" : ""}
        help={errors.classFormat?.message as string | undefined}
      >
        <Controller
          name="classFormat"
          control={control}
          render={({ field }) => (
            <Radio.Group {...field} optionType="button" buttonStyle="solid" className="w-full">
              {CLASS_FORMAT_OPTIONS.map((opt) => (
                <Radio.Button key={opt.value} value={opt.value}>
                  {opt.label}
                </Radio.Button>
              ))}
            </Radio.Group>
          )}
        />
      </Form.Item>

      {showLocation && (
        <>
          <Form.Item
            label="Tuition Location Type"
            validateStatus={errors.tuitionLocationType ? "error" : ""}
            help={errors.tuitionLocationType?.message as string | undefined}
          >
            <Controller
              name="tuitionLocationType"
              control={control}
              render={({ field }) => (
                <Radio.Group {...field} optionType="button" buttonStyle="solid" className="w-full">
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
            <AddressFields control={control as any} errors={errors as any} />
          </div>
        </>
      )}
    </div>
  );
}
