import { Button, Card, Space, Typography } from "antd";

const { Title, Text } = Typography;

export default function RegisterPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-100">
      <Card className="w-105 shadow-lg">
        <Space orientation="vertical" size="middle">
          <Title level={2}>Teacher Student Platform</Title>
          <Text>Register Page</Text>
          <Button type="primary" size="large">
            Register
          </Button>
        </Space>
      </Card>
    </main>
  );
}
