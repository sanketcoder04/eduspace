import { Button, Typography, message } from "antd";
import { useState } from "react";
import { MdOutlineMarkEmailRead } from "react-icons/md";
import { useLocation, useNavigate } from "react-router-dom";
import OTPInput from "@/components/auth/OTPInput/OTPInput";
import { useVerifyEmail } from "@/features/auth/hooks/useVerifyEmail";
import useCountdown from "@/features/auth/hooks/useCountDown";
import { useResendOtp } from "@/features/auth/hooks/useResendOtp";
import { ROUTES } from "@/router/routes";

const { Title, Text } = Typography;

export default function VerifyEmailPage() {
  const navigate = useNavigate();
  const { state } = useLocation();

  const email = state?.email;

  const [otp, setOtp] = useState("");
  const verifyEmailMutation = useVerifyEmail();
  const resendOtpMutation = useResendOtp();

  const { seconds, reset, isRunning } = useCountdown({
    initialSeconds: 60,
  });

  if (!email) {
    navigate(ROUTES.REGISTER, { replace: true });
    return null;
  }

  const handleVerify = async () => {
    if (otp.length !== 6) {
      message.error("Please enter the 6-digit verification code.");
      return;
    }

    try {
      await verifyEmailMutation.mutateAsync({
        email,
        otp,
      });

      message.success("Email verified successfully.");

      navigate(ROUTES.LOGIN, {
        replace: true,
      });
    } catch (error: any) {
      message.error(error?.response?.data?.message ?? "Verification failed. Please try again.");
    }
  };

  const handleResendOtp = async () => {
    try {
      await resendOtpMutation.mutateAsync({
        email,
      });

      message.success("A new verification OTP has been sent.");

      reset();
    } catch (error: any) {
      message.error(error?.response?.data?.message ?? "Failed to resend verification code.");
    }
  };

  return (
    <div className="mt-8 space-y-8 pb-10">
      {/* Heading */}
      <div className="space-y-2 text-center">
        <Title level={2} className="mb-0! text-racing-red-500!">
          Verify Your Email
        </Title>

        <Text type="secondary">
          We've sent a 6-digit verification code to your registered email.
        </Text>
        <Text className="font-medium text-racing-red-700! ml-2">{email}</Text>
      </div>

      {/* OTP */}
      <OTPInput value={otp} onChange={setOtp} />

      {/* Verify Button */}
      <Button
        type="primary"
        htmlType="submit"
        block
        size="middle"
        className="rounded-xl font-semibold"
        onClick={handleVerify}
        loading={verifyEmailMutation.isPending}
      >
        Verify Email
        <MdOutlineMarkEmailRead />
      </Button>

      {/* Resend */}
      <div className="space-y-2 text-center">
        <Text type="secondary">Didn't receive the verification code?</Text>

        <br />

        <Button
          type="link"
          disabled={isRunning || resendOtpMutation.isPending}
          loading={resendOtpMutation.isPending}
          onClick={handleResendOtp}
          className="px-0!"
        >
          {isRunning ? `Resend Code in ${seconds}s` : "Resend Code"}
        </Button>
      </div>
    </div>
  );
}
