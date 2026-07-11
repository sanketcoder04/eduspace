import { Link } from "react-router-dom";
import { Button, Typography } from "antd";
import { FiCheckCircle } from "react-icons/fi";
import OTPInput from "@/components/auth/OTPInput/OTPInput";
import { useState } from "react";

const { Title, Text } = Typography;

export default function VerifyOtpPage() {
  const [otp, setOtp] = useState("");

  return (
    <div className="mt-8 space-y-8 pb-10">
      {/* Heading */}

      <div className="space-y-2 text-center">
        <Title level={2} className="mb-0! text-racing-red-500!">
          Verify OTP
        </Title>

        <Text type="secondary">Enter the 6-digit verification code sent to your email.</Text>
      </div>

      {/* OTP */}

      <OTPInput value={otp} onChange={setOtp} length={6} />

      {/* Verify Button */}

      <Button type="primary" block size="middle" className="rounded-xl font-semibold">
        Verify OTP
        <FiCheckCircle />
      </Button>

      {/* Resend */}

      <div className="space-y-2 text-center">
        <Text type="secondary">Didn't receive the code?</Text>

        <br />

        <Button type="link" className="px-0!">
          Resend OTP
        </Button>
      </div>

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
    </div>
  );
}
