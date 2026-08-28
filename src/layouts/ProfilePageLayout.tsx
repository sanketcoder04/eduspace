import type { PropsWithChildren, ReactNode } from "react";
import { STICKY_CONTENT_TOP_CLASS } from "@/constants/layout";

interface ProfilePageLayoutProps extends PropsWithChildren {
  sidebar: ReactNode;
  recommendations?: ReactNode;
}

export default function ProfilePageLayout({
  sidebar,
  recommendations,
  children,
}: ProfilePageLayoutProps) {
  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8">
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[260px_minmax(0,1fr)_300px] lg:gap-6">
        {/* Left Sidebar */}
        <div
          className={`order-2 min-w-0 space-y-4 lg:order-1 lg:h-fit lg:sticky ${STICKY_CONTENT_TOP_CLASS}`}
        >
          {sidebar}
        </div>

        {/* Main Content */}
        <div className="order-1 min-w-0 space-y-4 lg:order-2">{children}</div>

        {/* Right Sidebar */}
        {recommendations && (
          <div
            className={`order-3 hidden min-w-0 lg:block lg:h-fit lg:sticky ${STICKY_CONTENT_TOP_CLASS}`}
          >
            {recommendations}
          </div>
        )}
      </div>
    </div>
  );
}
