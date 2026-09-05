import { Dropdown, Avatar, Skeleton } from "antd";
import { useNavigate } from "react-router-dom";
import { User as UserIcon, LogOut, Settings } from "lucide-react";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { useMyProfile } from "@/features/profile/hooks/useMyProfile";
import { logout as logoutApi } from "@/features/auth/services/auth.service";
import { tokenService } from "@/features/auth/services/token.service";
import { ROUTES } from "@/router/routes";

export default function UserMenu() {
  const navigate = useNavigate();
  const { auth, logout } = useAuth();
  const { profile, isLoading } = useMyProfile();

  const avatarUrl = profile && "avatarUrl" in profile ? profile.avatarUrl : undefined;

  // Every read here is fully optional-chained end to end. The previous
  // version — auth.user?.email.split("@")[0] — only guarded the `.email`
  // property access, not the `.split()` CALL: if auth.user was ever
  // undefined for a render (e.g. mid re-fetch after a token refresh), that
  // line threw a real runtime error and silently broke this component until
  // a full reload remounted everything cleanly. This can never throw.
  const displayName = profile?.name ?? auth.user?.email?.split("@")[0] ?? "Account";

  const handleLogout = async () => {
    try {
      const refreshToken = tokenService.getRefreshToken();
      if (refreshToken) await logoutApi({ refreshToken });
    } finally {
      logout();
      navigate(ROUTES.LOGIN, { replace: true });
    }
  };

  const items = [
    {
      key: "profile",
      label: "My Profile",
      icon: <UserIcon size={14} />,
      onClick: () => navigate(ROUTES.PROFILE),
    },
    {
      key: "settings",
      label: "Settings",
      icon: <Settings size={14} />,
      onClick: () => navigate(ROUTES.SETTINGS),
    },
    { type: "divider" as const },
    {
      key: "logout",
      label: "Log out",
      icon: <LogOut size={14} />,
      danger: true,
      onClick: handleLogout,
    },
  ];

  if (isLoading) {
    return <Skeleton.Avatar active size={32} shape="circle" />;
  }

  return (
    <Dropdown menu={{ items }} trigger={["click"]} placement="bottomRight">
      <button
        type="button"
        className="flex items-center gap-2 rounded-full p-1 transition hover:bg-gray-100 dark:hover:bg-neutral-800"
      >
        <Avatar size={32} src={avatarUrl} icon={!avatarUrl && <UserIcon size={16} />} />
        <span className="hidden pr-1 text-sm font-medium text-gray-700 dark:text-gray-200 sm:inline">
          {displayName}
        </span>
      </button>
    </Dropdown>
  );
}
