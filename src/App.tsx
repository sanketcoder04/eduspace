import { Button, Card, Space, Typography } from "antd";
import { TEST } from "@/utils/test";
import { ENV } from "@/config/env";

const { Title, Text } = Typography;

function App() {
  console.log(TEST);
  console.log(ENV.API_BASE_URL);

  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-100">
      <Card className="w-105 shadow-lg">
        <Space orientation="vertical" size="middle">
          <Title level={2}>Teacher Student Platform</Title>
          <Text>Find Your Perfect Match. Get Students or Teachers</Text>
          <Button type="primary" size="large">
            Get Started
          </Button>
        </Space>
      </Card>
    </main>
  );
}

export default App;
