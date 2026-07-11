import { Link } from "react-router-dom";

import { Button, Form, Input, Typography } from "antd";
import { LockKeyhole } from "lucide-react";
import { FiCheckCircle } from "react-icons/fi";

const { Title, Text } = Typography;

export default function ResetPasswordPage() {
  const [form] = Form.useForm();

  return (
    <div className="mt-8 space-y-8 pb-10">
      {/* Heading */}
      <div className="space-y-2 text-center">
        <Title level={2} className="mb-0! text-racing-red-500!">
          Reset Password
        </Title>

        <Text type="secondary">
          Create a new password for your account. Make sure it's strong and easy for you to
          remember.
        </Text>
      </div>

      {/* Form */}
      <Form form={form} layout="vertical" requiredMark={false} autoComplete="off" size="middle">
        {/* New Password */}
        <Form.Item
          label="New Password"
          name="password"
          rules={[
            {
              required: true,
              message: "Please enter your new password",
            },
            {
              min: 8,
              message: "Password must be at least 8 characters",
            },
          ]}
        >
          <Input.Password
            placeholder="Enter your new password"
            prefix={<LockKeyhole size={18} className="text-gray-400" />}
            className="rounded-xl"
          />
        </Form.Item>

        {/* Confirm Password */}
        <Form.Item
          label="Confirm Password"
          name="confirmPassword"
          dependencies={["password"]}
          rules={[
            {
              required: true,
              message: "Please confirm your password",
            },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue("password") === value) {
                  return Promise.resolve();
                }

                return Promise.reject(new Error("Passwords do not match"));
              },
            }),
          ]}
        >
          <Input.Password
            placeholder="Confirm your new password"
            prefix={<LockKeyhole size={18} className="text-gray-400" />}
            className="rounded-xl"
          />
        </Form.Item>

        {/* Reset Button */}
        <Button
          htmlType="submit"
          type="primary"
          block
          size="middle"
          className="rounded-xl font-semibold"
        >
          Reset Password
          <FiCheckCircle />
        </Button>

        {/* Footer */}
        <div className="mt-6 text-center">
          <Text type="secondary">Remember your password? </Text>

          <Link
            to="/login"
            className="font-semibold text-racing-red-600 transition hover:text-racing-red-700"
          >
            Back to Login
          </Link>
        </div>
      </Form>
    </div>
  );
}
