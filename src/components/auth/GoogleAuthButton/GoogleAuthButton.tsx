import { useEffect, useRef, useState } from "react";
import { GoogleLogin, type CredentialResponse } from "@react-oauth/google";
import { Button, message } from "antd";
import { FcGoogle } from "react-icons/fc";
import { useNavigate } from "react-router-dom";
import { useGoogleAuth } from "@/features/auth/hooks/useGoogleAuth";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { ROUTES } from "@/router/routes";

export default function GoogleAuthButton() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const googleAuthMutation = useGoogleAuth();

  const containerRef = useRef<HTMLDivElement>(null);
  const [buttonWidth, setButtonWidth] = useState<number>();

  useEffect(() => {
    if (!containerRef.current) return;

    const observer = new ResizeObserver((entries) => {
      const width = entries[0]?.contentRect.width;
      if (width) setButtonWidth(Math.floor(width));
    });

    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  const handleSuccess = async (credentialResponse: CredentialResponse) => {
    const idToken = credentialResponse.credential;

    if (!idToken) {
      message.error("Google sign-in failed. Please try again.");
      return;
    }

    try {
      const response = await googleAuthMutation.mutateAsync({ idToken });

      if (response.data.status === "LOGIN_SUCCESS" && response.data.auth) {
        const { token, user } = response.data.auth;
        login(token.accessToken, token.refreshToken, {
          id: user.id,
          email: user.email,
          role: user.role,
        });
        message.success(response.message);

        navigate(ROUTES.DASHBOARD, { replace: true });
        return;
      }

      if (response.data.status === "REGISTRATION_REQUIRED") {
        navigate(ROUTES.GOOGLE_SELECT_ROLE, {
          state: {
            registrationToken: response.data.registrationToken,
            email: response.data.email,
            name: response.data.name,
          },
        });
      }
    } catch (error: any) {
      message.error(error?.response?.data?.message ?? "Google sign-in failed. Please try again.");
    }
  };

  const isLoading = googleAuthMutation.isPending;

  return (
    <div ref={containerRef} className="relative w-full">
      {/* Decorative button — this is what the user sees */}
      <Button
        block
        size="middle"
        icon={<FcGoogle size={20} />}
        loading={isLoading}
        className="rounded-xl border-gray-300 font-medium pointer-events-none"
      >
        Continue with Google
      </Button>

      {/* Real Google button — invisible, stacked on top, handles the actual click */}
      {!isLoading && buttonWidth && (
        <div className="absolute inset-0 flex items-center justify-center overflow-hidden rounded-xl opacity-0">
          <GoogleLogin
            onSuccess={handleSuccess}
            onError={() => message.error("Google sign-in failed. Please try again.")}
            width={buttonWidth}
          />
        </div>
      )}
    </div>
  );
}
