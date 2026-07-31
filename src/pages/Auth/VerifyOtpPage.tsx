import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button, Typography, message } from "antd";
import { useEffect, useState } from "react";

import { FiCheckCircle } from "react-icons/fi";

import OTPInput from "@/components/auth/OTPInput/OTPInput";

import { ROUTES } from "@/router/routes";

import useCountdown from "@/features/auth/hooks/useCountdown";

import { useResendOtp } from "@/features/auth/hooks/useResendOtp";
import { useVerifyPasswordResetOtp } from "@/features/auth/hooks/useVerifyPasswordResetOtp";

const { Title, Text } = Typography;

export default function VerifyOtpPage() {
  const navigate = useNavigate();
  const { state } = useLocation();

  const email = state?.email;

  const [otp, setOtp] = useState("");

  const resendOtpMutation = useResendOtp();
  const verifyPasswordResetOtpMutation = useVerifyPasswordResetOtp();

  const { seconds, reset, isRunning } = useCountdown({
    initialSeconds: 60,
  });

  useEffect(() => {
    if (!email) {
      navigate(ROUTES.FORGOT_PASSWORD, {
        replace: true,
      });
    }
  }, [email, navigate]);

  const handleVerify = async () => {
    if (otp.length !== 6) {
      message.error("Please enter the 6-digit OTP.");
      return;
    }

    try {
      const response = await verifyPasswordResetOtpMutation.mutateAsync({
        email,
        otp,
      });

      message.success(response.message);

      navigate(ROUTES.RESET_PASSWORD, {
        state: {
          resetToken: response.data.resetToken,
        },
      });
    } catch (error: any) {
      message.error(error?.response?.data?.message ?? "Failed to Verify OTP");
    }
  };

  const handleResendOtp = async () => {
    try {
      const response = await resendOtpMutation.mutateAsync({
        email,
      });

      message.success(response.message);

      reset();
    } catch (error: any) {
      message.error(error?.response?.data?.message ?? "Failed Resend OTP");
    }
  };

  return (
    <div className="mx-auto mt-8 w-full max-w-md space-y-6 px-4 pb-10 sm:px-5 sm:space-y-8">
      {/* Heading */}

      <div className="space-y-2 text-center">
        <Title level={2} className="mb-0! text-racing-red-500!">
          Verify OTP
        </Title>

        <Text type="secondary">Enter the 6-digit verification code sent to</Text>

        <Text className="block break-all font-medium text-racing-red-600">{email}</Text>
      </div>

      {/* OTP */}

      <OTPInput value={otp} onChange={setOtp} length={6} />

      {/* Verify */}

      <Button
        type="primary"
        block
        size="middle"
        className="rounded-xl font-semibold"
        onClick={handleVerify}
        loading={verifyPasswordResetOtpMutation.isPending}
      >
        Verify OTP
        <FiCheckCircle />
      </Button>

      {/* Resend */}

      <div className="space-y-2 text-center">
        <Text type="secondary">Didn't receive the code?</Text>

        <br />

        <Button
          type="link"
          disabled={isRunning || resendOtpMutation.isPending}
          loading={resendOtpMutation.isPending}
          onClick={handleResendOtp}
          className="px-0!"
        >
          {isRunning ? `Resend OTP in ${seconds}s` : "Resend OTP"}
        </Button>
      </div>

      {/* Footer */}

      <div className="mt-6 text-center">
        <Text type="secondary">Remember your password? </Text>

        <Link
          to={ROUTES.LOGIN}
          className="font-semibold text-racing-red-600 transition hover:text-racing-red-700"
        >
          Back to Login
        </Link>
      </div>
    </div>
  );
}
