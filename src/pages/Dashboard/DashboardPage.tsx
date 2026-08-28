import { Card, Space, Typography } from "antd";

const { Title, Text } = Typography;

export default function DashboardPage() {
  return (
    <main className="flex min-h-130 items-center justify-center bg-gray-100">
      <Card className="w-105 shadow-lg">
        <Space orientation="vertical" size="middle">
          <Title level={2}>Teacher Student Platform</Title>
          <Text>Dashboard Page</Text>
        </Space>
      </Card>
    </main>
  );
}
