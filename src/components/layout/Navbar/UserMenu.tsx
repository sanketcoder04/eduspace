import { Dropdown, Avatar } from "antd";
import { useNavigate } from "react-router-dom";
import { User as UserIcon, LogOut, Settings } from "lucide-react";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { useMyProfile } from "@/features/profile/hooks/useMyProfile";
import { logout as logoutApi } from "@/features/auth/services/auth.service";
import { tokenService } from "@/features/auth/services/token.service";
import { ROUTES } from "@/router/routes";

export default function UserMenu() {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const { profile } = useMyProfile();

  const avatarUrl = profile && "avatarUrl" in profile ? profile.avatarUrl : undefined;

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

  return (
    <Dropdown menu={{ items }} trigger={["click"]} placement="bottomRight">
      <button
        type="button"
        className="flex items-center gap-2 rounded-full p-1 transition hover:bg-gray-100 dark:hover:bg-neutral-800 cursor-pointer"
      >
        <Avatar size={32} src={avatarUrl} icon={!avatarUrl && <UserIcon size={16} />} />
        <span className="hidden pr-1 text-sm font-medium text-gray-700 dark:text-gray-200 sm:inline">
          {profile?.name}
        </span>
      </button>
    </Dropdown>
  );
}
