/**
 * The desktop Navbar (see components/layout/Navbar/Navbar.tsx) is `sticky
 * top-0` and has an explicit height of 4rem (h-16). Any OTHER sticky element
 * that lives inside DashboardLayout's <main> — e.g. a sidebar — must offset
 * itself by at least this much, or it will stick at a position that overlaps
 * (renders "behind") the navbar once the page scrolls.
 *
 * Single source of truth: change the Navbar's height once here, and every
 * consumer below stays in sync instead of drifting out of alignment.
 */
export const NAVBAR_HEIGHT_PX = 64; // matches Navbar.tsx's h-16

/** Tailwind class for `top` offset — navbar height + a visual gap (24px). */
export const STICKY_CONTENT_TOP_CLASS = "lg:top-[88px]"; // 64px navbar + 24px gap

/**
 * Pinned page header (tabs + search + actions) on list pages. Sticky from `sm`
 * up only: on phones it stacks into 2-3 rows and would eat the screen.
 * `top` clears whichever navbar is showing: the 56px mobile top bar below
 * `lg`, the 64px desktop navbar from `lg`. z-30 stays under the navbar (z-40).
 */
export const STICKY_PAGE_HEADER_CLASS =
  "bg-gray-50/95 backdrop-blur dark:bg-neutral-950/95 sm:sticky sm:top-14 sm:z-30 sm:-mx-6 sm:px-6 sm:py-3 lg:top-16";

/**
 * Sidebar offset on pages WITH a pinned header: 64px navbar + ~72px header
 * (48px controls + 24px padding) + 16px gap. If you change the header's
 * height, change this too.
 */
export const STICKY_BELOW_PAGE_HEADER_TOP_CLASS = "lg:top-[152px]";
