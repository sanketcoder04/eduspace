import type { PropsWithChildren } from "react";
import { ConfigProvider } from "antd";
import { QueryClientProvider } from "@tanstack/react-query";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { queryClient } from "./queryClient";
import { antdTheme } from "@/theme";
import { AuthProvider } from "@/features/auth/context/AuthProvider";
import { ENV } from "@/config/env";

export function AppProviders({ children }: PropsWithChildren) {
  return (
    <GoogleOAuthProvider clientId={ENV.GOOGLE_CLIENT_ID}>
      <ConfigProvider theme={antdTheme}>
        <QueryClientProvider client={queryClient}>
          <AuthProvider>{children}</AuthProvider>
        </QueryClientProvider>
      </ConfigProvider>
    </GoogleOAuthProvider>
  );
}
