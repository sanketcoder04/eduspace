import { Link } from "react-router-dom";
import { Button, Form, Input, Typography } from "antd";
import { Mail } from "lucide-react";
import { FiArrowRight } from "react-icons/fi";
import AppLogo from "@/components/ui/AppLogo/AppLogo";

const { Title, Text } = Typography;

export default function ForgotPasswordPage() {
  const [form] = Form.useForm();

  return (
    <div className="mt-8 space-y-8 pb-10">
      {/* Heading */}
      <div className="space-y-2 text-center flex flex-col gap-4">
        <Title
          level={2}
          className="mb-0! text-racing-red-500! flex items-center justify-center gap-2"
        >
          <AppLogo showText={false} size="sm" /> EduHub
        </Title>

        <Text type="secondary" className="text-gray-800!">
          Enter your registered Email Address and we'll send you a Verification Code.
        </Text>
      </div>

      {/* Form */}
      <Form form={form} layout="vertical" requiredMark={false} autoComplete="off" size="middle">
        <Form.Item
          label="Email Address"
          name="email"
          rules={[
            {
              required: true,
              message: "Please enter your email",
            },
            {
              type: "email",
              message: "Please enter a valid email",
            },
          ]}
        >
          <Input
            placeholder="Enter your registered email"
            prefix={<Mail size={18} className="text-gray-400" />}
            className="rounded-xl"
          />
        </Form.Item>

        {/* Send OTP */}
        <Button
          htmlType="submit"
          type="primary"
          block
          size="middle"
          className="rounded-xl font-semibold mt-3"
        >
          Send OTP
          <FiArrowRight />
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
