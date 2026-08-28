import { Form, InputNumber, Select, Row, Col } from "antd";
import {
  Controller,
  type Control,
  type FieldErrors,
  type FieldValues,
  type Path,
} from "react-hook-form";
import { FEE_UNIT_OPTIONS } from "../constants/opportunityOptions";
import type { FeeRangeFormValues } from "@/schemas/opportunity/feeRange.schema";
import type { FeeUnit } from "../types/opportunity.types";

export interface FeeRangeFieldValues {
  feeRange: FeeRangeFormValues;
}

interface FeeRangeFieldsProps<T extends FieldValues & FeeRangeFieldValues> {
  control: Control<T>;
  errors: FieldErrors<T>;
}

export default function FeeRangeFields<T extends FieldValues & FeeRangeFieldValues>({
  control,
  errors,
}: FeeRangeFieldsProps<T>) {
  const feeErrors = errors.feeRange as FieldErrors<FeeRangeFormValues> | undefined;

  return (
    <div>
      <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
        Fees Range
      </label>
      <Row gutter={12}>
        <Col xs={12} sm={8}>
          <Form.Item
            validateStatus={feeErrors?.min ? "error" : ""}
            help={feeErrors?.min?.message}
            className="mb-0"
          >
            <Controller
              name={"feeRange.min" as Path<T>}
              control={control}
              render={({ field }) => (
                <InputNumber
                  {...field}
                  value={field.value as number}
                  placeholder="Min ₹"
                  min={0}
                  className="w-full rounded-xl"
                />
              )}
            />
          </Form.Item>
        </Col>
        <Col xs={12} sm={8}>
          <Form.Item
            validateStatus={feeErrors?.max ? "error" : ""}
            help={feeErrors?.max?.message}
            className="mb-0"
          >
            <Controller
              name={"feeRange.max" as Path<T>}
              control={control}
              render={({ field }) => (
                <InputNumber
                  {...field}
                  value={field.value as number}
                  placeholder="Max ₹"
                  min={0}
                  className="w-full rounded-xl"
                />
              )}
            />
          </Form.Item>
        </Col>
        <Col xs={24} sm={8}>
          <Form.Item
            validateStatus={feeErrors?.unit ? "error" : ""}
            help={feeErrors?.unit?.message}
            className="mb-0"
          >
            <Controller
              name={"feeRange.unit" as Path<T>}
              control={control}
              render={({ field }) => (
                <Select
                  {...field}
                  value={field.value as FeeUnit}
                  placeholder="Per..."
                  options={FEE_UNIT_OPTIONS}
                  className="w-full"
                />
              )}
            />
          </Form.Item>
        </Col>
      </Row>
    </div>
  );
}
