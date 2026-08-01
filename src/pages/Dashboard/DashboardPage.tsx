import { useAuth } from "@/features/auth/hooks/useAuth";
import { logout } from "@/features/auth/services/auth.service";
import { tokenService } from "@/features/auth/services/token.service";
import { ROUTES } from "@/router/routes";
import { Button, Card, Space, Typography } from "antd";
import { useNavigate } from "react-router-dom";

const { Title, Text } = Typography;

export default function DashboardPage() {
  const navigate = useNavigate();
  const { logout: contextLogout } = useAuth();
  const refreshToken = tokenService.getRefreshToken();

  const handleLogout = async () => {
    try {
      if (refreshToken) await logout({ refreshToken });
    } finally {
      contextLogout();
      navigate(ROUTES.LOGIN, { replace: true });
    }
  };
  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-100">
      <Card className="w-105 shadow-lg">
        <Space orientation="vertical" size="middle">
          <Title level={2}>Teacher Student Platform</Title>
          <Text>Dashboard Page</Text>
          <Button type="primary" size="large" onClick={handleLogout}>
            Logout
          </Button>
        </Space>
      </Card>
    </main>
  );
}
