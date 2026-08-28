import type { PropsWithChildren } from "react";
import AppNavigation from "@/components/layout/Navbar";

export default function DashboardLayout({ children }: PropsWithChildren) {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-neutral-950">
      <AppNavigation />
      <main className="pb-20 lg:pb-0">{children}</main>
    </div>
  );
}
