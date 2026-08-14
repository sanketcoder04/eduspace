import { Form, Input, Row, Col } from "antd";
import {
  Controller,
  type Control,
  type FieldErrors,
  type FieldValues,
  type Path,
} from "react-hook-form";
import { MapPin } from "lucide-react";
import type { AddressFormValues } from "@/schemas/profile/address.schema";

interface AddressFieldsProps<T extends FieldValues & { address: AddressFormValues }> {
  control: Control<T>;
  errors: FieldErrors<T>;
}

export default function AddressFields<T extends FieldValues & { address: AddressFormValues }>({
  control,
  errors,
}: AddressFieldsProps<T>) {
  const addressErrors = errors.address as FieldErrors<AddressFormValues> | undefined;

  return (
    <div className="space-y-4">
      <Form.Item
        label="Address line 1"
        validateStatus={addressErrors?.line1 ? "error" : ""}
        help={addressErrors?.line1?.message}
      >
        <Controller
          name={"address.line1" as Path<T>}
          control={control}
          render={({ field }) => (
            <Input
              {...field}
              value={field.value as string}
              placeholder="House no, street"
              prefix={<MapPin size={16} className="text-gray-400" />}
              className="rounded-xl"
            />
          )}
        />
      </Form.Item>

      <Form.Item label="Address line 2 (optional)">
        <Controller
          name={"address.line2" as Path<T>}
          control={control}
          render={({ field }) => (
            <Input
              {...field}
              value={field.value as string}
              placeholder="Landmark, area"
              className="rounded-xl"
            />
          )}
        />
      </Form.Item>

      <Row gutter={12}>
        <Col xs={24} sm={12}>
          <Form.Item
            label="City"
            validateStatus={addressErrors?.city ? "error" : ""}
            help={addressErrors?.city?.message}
          >
            <Controller
              name={"address.city" as Path<T>}
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  value={field.value as string}
                  placeholder="City"
                  className="rounded-xl"
                />
              )}
            />
          </Form.Item>
        </Col>
        <Col xs={24} sm={12}>
          <Form.Item
            label="State"
            validateStatus={addressErrors?.state ? "error" : ""}
            help={addressErrors?.state?.message}
          >
            <Controller
              name={"address.state" as Path<T>}
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  value={field.value as string}
                  placeholder="State"
                  className="rounded-xl"
                />
              )}
            />
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={12}>
        <Col xs={24} sm={12}>
          <Form.Item
            label="Pincode"
            validateStatus={addressErrors?.pincode ? "error" : ""}
            help={addressErrors?.pincode?.message}
          >
            <Controller
              name={"address.pincode" as Path<T>}
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  value={field.value as string}
                  placeholder="Pincode"
                  className="rounded-xl"
                />
              )}
            />
          </Form.Item>
        </Col>
        <Col xs={24} sm={12}>
          <Form.Item
            label="Country"
            validateStatus={addressErrors?.country ? "error" : ""}
            help={addressErrors?.country?.message}
          >
            <Controller
              name={"address.country" as Path<T>}
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  value={field.value as string}
                  placeholder="Country"
                  className="rounded-xl"
                />
              )}
            />
          </Form.Item>
        </Col>
      </Row>
    </div>
  );
}
