import AppLogo from "@/components/ui/AppLogo/AppLogo";
import NotificationBellMobile from "./NotificationBellMobile";
import UserMenu from "./UserMenu";

export default function MobileTopBar() {
  return (
    <header className="sticky top-0 z-40 flex h-14 items-center justify-between border-b border-gray-200 bg-white/95 px-4 backdrop-blur dark:border-neutral-800 dark:bg-neutral-900/95 lg:hidden">
      <AppLogo size="sm" showText={false} />
      <div className="flex items-center gap-1">
        <NotificationBellMobile />
        <UserMenu />
      </div>
    </header>
  );
}
