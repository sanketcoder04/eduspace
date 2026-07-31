import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button, Form, Input, Typography, message } from "antd";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { LockKeyhole } from "lucide-react";
import { FiCheckCircle } from "react-icons/fi";
import { ROUTES } from "@/router/routes";
import {
  resetPasswordSchema,
  type ResetPasswordFormValues,
} from "@/schemas/auth/resetPassword.schema";
import { useResetPassword } from "@/features/auth/hooks/useResetPassword";

const { Title, Text } = Typography;

export default function ResetPasswordPage() {
  const navigate = useNavigate();
  const { state } = useLocation();

  const resetToken = state?.resetToken;

  const resetPasswordMutation = useResetPassword();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      newPassword: "",
      confirmPassword: "",
    },
  });

  if (!resetToken) {
    navigate(ROUTES.FORGOT_PASSWORD, {
      replace: true,
    });

    return null;
  }

  const onSubmit = async (values: ResetPasswordFormValues) => {
    try {
      const response = await resetPasswordMutation.mutateAsync({
        resetToken,
        newPassword: values.newPassword,
      });

      message.success(response.message);

      navigate(ROUTES.LOGIN, {
        replace: true,
      });
    } catch (error: any) {
      message.error(error?.response?.data?.message ?? "Failed Reset Password");
    }
  };

  return (
    <div className="mt-8 space-y-8 pb-10">
      {/* Heading */}

      <div className="space-y-2 text-center">
        <Title level={2} className="mb-0! text-racing-red-500!">
          Reset Password
        </Title>

        <Text type="secondary">Create a strong password for your account.</Text>
      </div>

      {/* Form */}

      <Form
        layout="vertical"
        requiredMark={false}
        autoComplete="off"
        onFinish={handleSubmit(onSubmit)}
      >
        {/* Password */}

        <Form.Item
          label="New Password"
          validateStatus={errors.newPassword ? "error" : ""}
          help={errors.newPassword?.message}
        >
          <Controller
            control={control}
            name="newPassword"
            render={({ field }) => (
              <Input.Password
                {...field}
                placeholder="Enter new password"
                prefix={<LockKeyhole size={18} className="text-gray-400" />}
                className="rounded-xl"
              />
            )}
          />
        </Form.Item>

        {/* Confirm */}

        <Form.Item
          label="Confirm Password"
          validateStatus={errors.confirmPassword ? "error" : ""}
          help={errors.confirmPassword?.message}
        >
          <Controller
            control={control}
            name="confirmPassword"
            render={({ field }) => (
              <Input.Password
                {...field}
                placeholder="Confirm password"
                prefix={<LockKeyhole size={18} className="text-gray-400" />}
                className="rounded-xl"
              />
            )}
          />
        </Form.Item>

        <Button
          htmlType="submit"
          type="primary"
          block
          loading={resetPasswordMutation.isPending}
          className="rounded-xl font-semibold"
        >
          Reset Password
          <FiCheckCircle />
        </Button>

        <div className="mt-6 text-center">
          <Text type="secondary">Remember your password? </Text>

          <Link
            to={ROUTES.LOGIN}
            className="font-semibold text-racing-red-600 hover:text-racing-red-700"
          >
            Back to Login
          </Link>
        </div>
      </Form>
    </div>
  );
}
