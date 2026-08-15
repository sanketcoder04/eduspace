import type { PropsWithChildren, ReactNode } from "react";

interface ProfilePageLayoutProps extends PropsWithChildren {
  sidebar: ReactNode;
  recommendations?: ReactNode;
}

// Three-column desktop layout (sidebar / main / recommendations), collapsing
// to a single stacked column below `lg`. Sidebar content (identity + stats)
// moves below the main profile content on mobile via `order-*` rather than
// being duplicated or hidden — same DOM node either way, just repositioned.
export default function ProfilePageLayout({
  sidebar,
  recommendations,
  children,
}: ProfilePageLayoutProps) {
  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8">
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[260px_1fr_300px] lg:gap-6">
        <div className="order-2 space-y-4 lg:sticky lg:top-6 lg:order-1 lg:h-fit">{sidebar}</div>

        <div className="order-1 space-y-4 lg:order-2">{children}</div>

        {recommendations && (
          <div className="order-3 hidden lg:sticky lg:top-6 lg:block lg:h-fit">
            {recommendations}
          </div>
        )}
      </div>
    </div>
  );
}
