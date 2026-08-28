import { NavLink } from "react-router-dom";
import AppLogo from "@/components/ui/AppLogo/AppLogo";
import NotificationBellDesktop from "./NotificationBellDesktop";
import UserMenu from "./UserMenu";
import { NAV_LINKS } from "./NavLinks";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-40 hidden h-16 border-b border-gray-200 bg-white/95 backdrop-blur dark:border-neutral-800 dark:bg-neutral-900/95 lg:block">
      <div className="mx-auto flex h-full max-w-7xl items-center justify-between px-6">
        <AppLogo size="sm" />

        <nav className="flex items-center gap-1">
          {NAV_LINKS.map(({ label, to, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) => `
                flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition
                ${
                  isActive
                    ? "bg-racing-red-50 text-racing-red-600 dark:bg-racing-red-950 dark:text-racing-red-300"
                    : "text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-neutral-800"
                }
              `}
            >
              <Icon size={16} />
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <NotificationBellDesktop />
          <UserMenu />
        </div>
      </div>
    </header>
  );
}
