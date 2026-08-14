import type { PropsWithChildren } from "react";
import { Steps, Typography, Progress } from "antd";
import AppLogo from "@/components/ui/AppLogo/AppLogo";

const { Title, Text } = Typography;

interface StepItem {
  title: string;
  description?: string;
}

interface ProfileWizardLayoutProps extends PropsWithChildren {
  steps: StepItem[];
  currentStep: number;
  subtitle?: string;
}

// LinkedIn-esque onboarding shell: quiet header, a progress indicator that
// adapts to the viewport (full Steps rail on tablet/desktop, a slim progress
// bar + "Step X of Y" on mobile so nothing wraps awkwardly), and a centered
// content card for the active step's form.
export default function ProfileWizardLayout({
  steps,
  currentStep,
  subtitle,
  children,
}: ProfileWizardLayoutProps) {
  const percent = Math.round(((currentStep + 1) / steps.length) * 100);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-neutral-950">
      <header className="border-b border-gray-200 bg-white px-4 py-4 dark:border-neutral-800 dark:bg-neutral-900 sm:px-8">
        <div className="mx-auto flex max-w-4xl items-center justify-between">
          <AppLogo size="sm" showText={false} />
          <Text type="secondary" className="text-xs sm:text-sm">
            Step {currentStep + 1} of {steps.length}
          </Text>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-4 py-6 sm:px-8 sm:py-10">
        <div className="mb-6 text-center sm:mb-8">
          <Title level={3} className="mb-1! text-racing-red-500!">
            {steps[currentStep]?.title}
          </Title>
          {subtitle && <Text type="secondary">{subtitle}</Text>}
        </div>

        <div className="mb-6 sm:hidden">
          <Progress
            percent={percent}
            showInfo={false}
            strokeColor="var(--color-racing-red-500)"
            trailColor="#e5e7eb"
          />
        </div>

        <div className="mb-8 hidden sm:block">
          <Steps
            current={currentStep}
            items={steps.map((s) => ({ title: s.title }))}
            size="small"
          />
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-neutral-800 dark:bg-neutral-900 sm:p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
