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
