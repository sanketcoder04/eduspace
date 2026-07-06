import { Button, Card, Space, Typography } from "antd";

const { Title, Text } = Typography;

export default function NotFoundPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-100">
      <Card className="w-105 shadow-lg">
        <Space orientation="vertical" size="middle">
          <Title level={2}>Teacher Student Platform</Title>
          <Text>Page Not Found</Text>
          <Button type="primary" size="large">
            Error
          </Button>
        </Space>
      </Card>
    </main>
  );
}
