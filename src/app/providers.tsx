import type { PropsWithChildren } from "react";
import { ConfigProvider } from "antd";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./queryClient";
import { antdTheme } from "@/theme";
import { AuthProvider } from "@/features/auth/context/AuthProvider";

export function AppProviders({ children }: PropsWithChildren) {
  return (
    <ConfigProvider theme={antdTheme}>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>{children}</AuthProvider>
      </QueryClientProvider>
    </ConfigProvider>
  );
}
