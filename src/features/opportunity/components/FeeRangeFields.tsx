import { Form, InputNumber, Select, Row, Col } from "antd";
import { Controller, type Control, type FieldErrors } from "react-hook-form";
import { FEE_UNIT_OPTIONS } from "../constants/opportunityOptions";

interface FeeRangeFieldsProps {
  control: Control<any>;
  errors: FieldErrors<any>;
}

export default function FeeRangeFields({ control, errors }: FeeRangeFieldsProps) {
  const feeErrors = errors.feeRange as
    | { min?: { message?: string }; max?: { message?: string }; unit?: { message?: string } }
    | undefined;

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
              name="feeRange.min"
              control={control}
              render={({ field }) => (
                <InputNumber {...field} placeholder="Min ₹" min={0} className="w-full rounded-xl" />
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
              name="feeRange.max"
              control={control}
              render={({ field }) => (
                <InputNumber {...field} placeholder="Max ₹" min={0} className="w-full rounded-xl" />
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
              name="feeRange.unit"
              control={control}
              render={({ field }) => (
                <Select
                  {...field}
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
