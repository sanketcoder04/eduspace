import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Button, Radio, Typography, message } from "antd";
import { FiUserPlus } from "react-icons/fi";
import { ROUTES } from "@/router/routes";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { useCompleteGoogleRegistration } from "@/features/auth/hooks/useCompleteGoogleRegistration";
import type { UserRole } from "@/features/auth/types/auth.types";

const { Title, Text } = Typography;

interface LocationState {
  registrationToken?: string;
  email?: string;
  name?: string;
}

export default function GoogleSelectRolePage() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const { login } = useAuth();

  const { registrationToken, email, name } = (state as LocationState) ?? {};
  const [role, setRole] = useState<UserRole>("STUDENT");

  const completeMutation = useCompleteGoogleRegistration();

  useEffect(() => {
    if (!registrationToken) {
      navigate(ROUTES.REGISTER, { replace: true });
    }
  }, [registrationToken, navigate]);

  if (!registrationToken) return null;

  const handleContinue = async () => {
    try {
      const response = await completeMutation.mutateAsync({ registrationToken, role });
      const { token, user } = response.data;

      login(token.accessToken, token.refreshToken, {
        id: user.id,
        email: user.email,
        role: user.role,
      });

      message.success(response.message);
      navigate(ROUTES.DASHBOARD, { replace: true });
    } catch (error: any) {
      message.error(
        error?.response?.data?.message ?? "Could not complete registration. Please try again."
      );
    }
  };

  return (
    <div className="mt-8 space-y-8 pb-10">
      <div className="space-y-2 text-center">
        <Title level={2} className="mb-0! text-racing-red-500!">
          Almost there{name ? `, ${name}` : ""}!
        </Title>
        <Text type="secondary">{email ? `Signing up as ${email}. ` : ""}</Text>
      </div>

      <div className="mb-2">
        <Text type="secondary">Register as</Text>
      </div>

      <div className="space-y-6 flex flex-col gap-5">
        <Radio.Group
          value={role}
          onChange={(event) => setRole(event.target.value)}
          optionType="button"
          buttonStyle="solid"
          className="w-full flex mb-5"
        >
          <Radio.Button value="STUDENT" className="flex-1 text-center">
            Student
          </Radio.Button>
          <Radio.Button value="TEACHER" className="flex-1 text-center">
            Teacher
          </Radio.Button>
        </Radio.Group>

        <Button
          type="primary"
          block
          loading={completeMutation.isPending}
          onClick={handleContinue}
          className="rounded-xl font-semibold"
        >
          Continue
          <FiUserPlus />
        </Button>
      </div>
    </div>
  );
}
