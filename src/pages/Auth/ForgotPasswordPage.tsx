import { Link, useNavigate } from "react-router-dom";
import { Button, Form, Input, Typography, message } from "antd";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Mail } from "lucide-react";
import { IoArrowBackOutline } from "react-icons/io5";
import { MdOutlineMarkEmailRead } from "react-icons/md";
import { ROUTES } from "@/router/routes";
import {
  forgotPasswordSchema,
  type ForgotPasswordFormValues,
} from "@/schemas/auth/forgotPassword.schema";
import { useForgotPassword } from "@/features/auth/hooks/useForgotPassword";

const { Title, Text } = Typography;

export default function ForgotPasswordPage() {
  const navigate = useNavigate();

  const forgotPasswordMutation = useForgotPassword();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (values: ForgotPasswordFormValues) => {
    try {
      const response = await forgotPasswordMutation.mutateAsync(values);

      message.success(response.message);

      navigate(ROUTES.VERIFY_OTP, {
        state: {
          email: values.email,
        },
      });
    } catch (error: any) {
      message.error(error?.response?.data?.message ?? "Something went wrong. Please try again.");
    }
  };

  return (
    <div className="space-y-8">
      {/* Heading */}
      <div className="mt-8 space-y-2 text-center">
        <Title level={2} className="mb-0! text-racing-red-500!">
          Forgot Password
        </Title>

        <Text type="secondary">
          Enter your registered email address. If an account exists, we'll send you a password reset
          OTP.
        </Text>
      </div>

      {/* Form */}
      <Form
        layout="vertical"
        requiredMark={false}
        autoComplete="off"
        onFinish={handleSubmit(onSubmit)}
      >
        <Form.Item
          label="Email Address"
          validateStatus={errors.email ? "error" : ""}
          help={errors.email?.message}
        >
          <Controller
            control={control}
            name="email"
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

        <Button
          htmlType="submit"
          type="primary"
          block
          loading={forgotPasswordMutation.isPending}
          className="rounded-xl font-semibold"
        >
          Send Reset OTP
          <MdOutlineMarkEmailRead />
        </Button>

        <div className="mt-6 text-center">
          <Link
            to={ROUTES.LOGIN}
            className="inline-flex items-center gap-2 font-medium text-racing-red-600 transition hover:text-racing-red-700"
          >
            <IoArrowBackOutline />
            Back to Login
          </Link>
        </div>
      </Form>
    </div>
  );
}
