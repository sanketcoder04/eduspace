import type { PropsWithChildren } from "react";
import { ConfigProvider } from "antd";
import { QueryClientProvider } from "@tanstack/react-query";

import { queryClient } from "./queryClient";
import { antdTheme } from "@/theme";

export function AppProviders({ children }: PropsWithChildren) {
  return (
    <ConfigProvider theme={antdTheme}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </ConfigProvider>
  );
}
