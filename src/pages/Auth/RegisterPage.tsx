import { Link } from "react-router-dom";
import { Button, Checkbox, Divider, Form, Input, Radio, Typography } from "antd";
import { LockKeyhole, Mail, User } from "lucide-react";
import { FcGoogle } from "react-icons/fc";
import { FiUserPlus } from "react-icons/fi";
import AppLogo from "@/components/ui/AppLogo/AppLogo";

const { Title, Text } = Typography;

export default function RegisterPage() {
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
          Create a new Account.
        </Text>
      </div>

      {/* Form */}
      <Form form={form} layout="vertical" requiredMark={false} autoComplete="off" size="middle">
        {/* Full Name */}
        <Form.Item
          label="Full Name"
          name="fullName"
          rules={[
            {
              required: true,
              message: "Please enter your full name",
            },
          ]}
        >
          <Input
            placeholder="Enter your full name"
            prefix={<User size={18} className="text-gray-400" />}
            className="rounded-xl"
          />
        </Form.Item>

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
              message: "Please enter a valid email",
            },
          ]}
        >
          <Input
            placeholder="Enter your email"
            prefix={<Mail size={18} className="text-gray-400" />}
            className="rounded-xl"
          />
        </Form.Item>

        {/* Role */}
        <Form.Item
          label="Register As"
          name="role"
          initialValue="student"
          rules={[
            {
              required: true,
              message: "Please select your role",
            },
          ]}
        >
          <Radio.Group className="flex gap-6">
            <Radio value="student">Student</Radio>
            <Radio value="teacher">Teacher</Radio>
          </Radio.Group>
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
            placeholder="Create a password"
            prefix={<LockKeyhole size={18} className="text-gray-400" />}
            className="rounded-xl"
          />
        </Form.Item>

        {/* Terms */}
        <Form.Item
          name="terms"
          valuePropName="checked"
          rules={[
            {
              validator: (_, value) =>
                value
                  ? Promise.resolve()
                  : Promise.reject(new Error("Please accept the Terms & Conditions")),
            },
          ]}
        >
          <Checkbox>
            I agree to the{" "}
            <Link to="/terms" className="font-medium text-racing-red-600 hover:text-racing-red-700">
              Terms & Conditions
            </Link>{" "}
            and{" "}
            <Link
              to="/privacy"
              className="font-medium text-racing-red-600 hover:text-racing-red-700"
            >
              Privacy Policy
            </Link>
            .
          </Checkbox>
        </Form.Item>

        {/* Register Button */}
        <Button
          htmlType="submit"
          type="primary"
          block
          size="middle"
          className="rounded-xl font-semibold"
        >
          Create Account
          <FiUserPlus />
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
          size="middle"
          icon={<FcGoogle size={20} />}
          className="rounded-xl border-gray-300 font-medium"
        >
          Continue with Google
        </Button>

        {/* Footer */}
        <div className="mt-4 text-center">
          <Text type="secondary">Already have an account? </Text>

          <Link to="/login" className="font-semibold text-racing-red-600 hover:text-racing-red-700">
            Login
          </Link>
        </div>
      </Form>
    </div>
  );
}
