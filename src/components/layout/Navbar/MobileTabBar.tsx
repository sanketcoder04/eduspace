import { NavLink } from "react-router-dom";
import { NAV_LINKS } from "./NavLinks";

export default function MobileTabBar() {
  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-gray-200 bg-white/95 backdrop-blur dark:border-neutral-800 dark:bg-neutral-900/95 lg:hidden">
      <div className="flex items-center justify-around px-1 py-1.5">
        {NAV_LINKS.map(({ label, to, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) => `
              flex flex-1 flex-col items-center gap-0.5 rounded-xl px-2 py-1.5 text-[11px] font-medium transition
              ${isActive ? "text-racing-red-600 dark:text-racing-red-300" : "text-gray-500 dark:text-gray-400"}
            `}
          >
            <Icon size={20} />
            {label}
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
