import { Link } from "react-router-dom";
import { Button, Checkbox, Divider, Form, Input, Typography } from "antd";
import { LockKeyhole, Mail } from "lucide-react";
import { FcGoogle } from "react-icons/fc";
import { FiLogIn } from "react-icons/fi";
import AppLogo from "@/components/ui/AppLogo/AppLogo";

const { Title, Text } = Typography;

export default function LoginPage() {
  const [form] = Form.useForm();

  return (
    <div className="mt-8 space-y-8 pb-4.5">
      {/* Heading */}
      <div className="space-y-2 text-center flex flex-col gap-4">
        <Title
          level={2}
          className="mb-0! text-racing-red-500! flex items-center justify-center gap-2"
        >
          <AppLogo showText={false} size="sm" /> EduHub
        </Title>

        <Text type="secondary" className="text-gray-800!">
          Login to Continue.
        </Text>
      </div>

      {/* Form */}
      <Form form={form} layout="vertical" requiredMark={false} autoComplete="off" size="medium">
        {/* Email */}
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
              message: "Enter a valid email",
            },
          ]}
        >
          <Input
            placeholder="Enter your email"
            prefix={<Mail size={18} className="text-gray-400" />}
            className="rounded-xl"
          />
        </Form.Item>

        {/* Password */}
        <Form.Item
          label="Password"
          name="password"
          rules={[
            {
              required: true,
              message: "Please enter your password",
            },
          ]}
        >
          <Input.Password
            placeholder="Enter your password"
            prefix={<LockKeyhole size={18} className="text-gray-400" />}
            className=" rounded-xl"
          />
        </Form.Item>

        {/* Remember + Forgot */}
        <div className="mb-6 flex items-center justify-between">
          <Checkbox>Remember me</Checkbox>

          <Link
            to="/forgot-password"
            className="font-medium text-racing-red-600 transition hover:text-racing-red-700"
          >
            Forgot Password?
          </Link>
        </div>

        {/* Login Button */}
        <Button
          htmlType="submit"
          type="primary"
          block
          size="medium"
          className="rounded-xl font-semibold "
        >
          Login
          <FiLogIn />
        </Button>

        {/* Divider */}
        <Divider className="my-4!">
          <span className="text-xs font-medium uppercase tracking-wider text-gray-400">
            OR CONTINUE WITH
          </span>
        </Divider>

        {/* Google */}
        <Button
          block
          size="medium"
          icon={<FcGoogle size={20} />}
          className="rounded-xl border-gray-300 font-medium"
        >
          Continue with Google
        </Button>

        {/* Footer */}
        <div className="mt-4 text-center">
          <Text type="secondary">Don't have an account? </Text>

          <Link
            to="/register"
            className="font-semibold text-racing-red-600 hover:text-racing-red-700"
          >
            Create Account
          </Link>
        </div>
      </Form>
    </div>
  );
}
