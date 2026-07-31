import { Link, useNavigate } from "react-router-dom";
import { Button, Checkbox, Divider, Form, Input, Radio, Typography, message } from "antd";
import { LockKeyhole, Mail, User } from "lucide-react";
import { FcGoogle } from "react-icons/fc";
import { FiUserPlus } from "react-icons/fi";
import AppLogo from "@/components/ui/AppLogo/AppLogo";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ROUTES } from "@/router/routes";
import { registerSchema, type RegisterFormValues } from "@/schemas/auth/register.schema";
import { useRegister } from "@/features/auth/hooks/useRegister";

const { Title, Text } = Typography;

export default function RegisterPage() {
  const navigate = useNavigate();

  const registerMutation = useRegister();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      role: "STUDENT",
    },
  });

  const onSubmit = async (values: RegisterFormValues) => {
    try {
      await registerMutation.mutateAsync({
        name: values.name,
        email: values.email,
        password: values.password,
        role: values.role,
      });

      message.success("Registration successful.");

      navigate(ROUTES.VERIFY_EMAIL, {
        state: {
          email: values.email,
        },
      });
    } catch (error: any) {
      message.error(error?.response?.data?.message ?? "Registration failed. Please try again.");
    }
  };

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
      <Form
        onFinish={handleSubmit(onSubmit)}
        layout="vertical"
        requiredMark={false}
        autoComplete="off"
        size="middle"
      >
        {/* Full Name */}
        <Form.Item
          label="Full Name"
          validateStatus={errors.name ? "error" : ""}
          help={errors.name?.message}
        >
          <Controller
            name="name"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                placeholder="Enter your full name"
                prefix={<User size={18} className="text-gray-400" />}
                className="rounded-xl"
              />
            )}
          />
        </Form.Item>

        {/* Email */}
        <Form.Item
          label="Email Address"
          validateStatus={errors.email ? "error" : ""}
          help={errors.email?.message}
        >
          <Controller
            name="email"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                placeholder="Enter your email"
                prefix={<Mail size={18} className="text-gray-400" />}
                className="rounded-xl"
              />
            )}
          />
        </Form.Item>

        {/* Role */}
        <Form.Item
          label="Register as"
          validateStatus={errors.role ? "error" : ""}
          help={errors.role?.message}
        >
          <Controller
            name="role"
            control={control}
            render={({ field }) => (
              <Radio.Group {...field} optionType="button" buttonStyle="solid" className="w-full">
                <Radio.Button value="STUDENT">Student</Radio.Button>
                <Radio.Button value="TEACHER">Teacher</Radio.Button>
              </Radio.Group>
            )}
          />
        </Form.Item>

        {/* Password */}
        <Form.Item
          label="Password"
          validateStatus={errors.password ? "error" : ""}
          help={errors.password?.message}
        >
          <Controller
            name="password"
            control={control}
            render={({ field }) => (
              <Input.Password
                {...field}
                prefix={<LockKeyhole size={18} className="text-gray-400" />}
                placeholder="Create a password"
                className="rounded-xl"
              />
            )}
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
          loading={registerMutation.isPending}
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

          <Link
            to={ROUTES.LOGIN}
            className="font-semibold text-racing-red-600 hover:text-racing-red-700"
          >
            Login
          </Link>
        </div>
      </Form>
    </div>
  );
}
