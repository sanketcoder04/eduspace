import { Button, Typography } from "antd";
import { useState } from "react";
import { MdOutlineMarkEmailRead } from "react-icons/md";

import OTPInput from "@/components/auth/OTPInput/OTPInput";

const { Title, Text } = Typography;

export default function VerifyEmailPage() {
  const [otp, setOtp] = useState("");

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
        <Text className="font-medium text-racing-red-700! ml-2">sanke*****@gmail.com</Text>
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
      >
        Verify Email
        <MdOutlineMarkEmailRead />
      </Button>

      {/* Resend */}
      <div className="space-y-2 text-center">
        <Text type="secondary">Didn't receive the verification code?</Text>

        <br />

        <Button type="link" className="px-0!">
          Resend Code
        </Button>
      </div>
    </div>
  );
}
