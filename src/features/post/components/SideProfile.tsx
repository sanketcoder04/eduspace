import { Typography } from "antd";
import { MapPin } from "lucide-react";
import type { Address, VerificationStatus } from "@/features/profile/types/profile.types";
import VerificationBadge from "@/features/profile/components/display/VerificationBadge";
import CoverPhotoUpload from "@/features/profile/components/shared/CoverPhotoUpload";
import { ROUTES } from "@/router/routes";
import { Link } from "react-router-dom";

const { Text } = Typography;

interface SideProfileProps {
  name: string;
  headline?: string;
  about?: string;
  avatarUrl?: string;
  coverImageUrl?: string;
  address?: Address;
  verificationStatus: VerificationStatus;
  isOwner: boolean;
  onCoverChange?: (url: string) => void;
  showCover?: boolean;
}

export default function SideProfile({
  name,
  headline,
  about,
  avatarUrl,
  coverImageUrl,
  address,
  verificationStatus,
  isOwner,
  onCoverChange,
  showCover = true,
}: SideProfileProps) {
  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-neutral-800 dark:bg-neutral-900 md:none">
      {showCover && (
        <CoverPhotoUpload
          value={coverImageUrl}
          onChange={(url) => onCoverChange?.(url)}
          isOwner={!isOwner}
        />
      )}

      <div className={`px-4 pb-5 sm:px-8 sm:pb-8 ${showCover ? "" : "pt-5 sm:pt-8"}`}>
        <div
          className={
            showCover
              ? "-mt-12 flex items-end justify-between sm:-mt-16"
              : "flex items-end justify-between"
          }
        >
          <div className="z-10 flex h-24 w-24 overflow-hidden rounded-full bg-gray-200 text-2xl font-semibold text-gray-500 shadow-md dark:border-neutral-900">
            {avatarUrl ? (
              <img src={avatarUrl} alt={name} className="h-full w-full object-cover" />
            ) : (
              name?.charAt(0)
            )}
          </div>
        </div>

        <div className="mt-4 space-y-1">
          <div className="flex flex-wrap items-center gap-2">
            <Link to={ROUTES.PROFILE}>
              <p className="mb-0! text-xl font-semibold hover:text-racing-red-600 dark:hover:text-racing-red-300">
                {name}
              </p>
            </Link>

            <VerificationBadge status={verificationStatus} />
          </div>

          {headline && (
            <Text className="block text-base text-gray-600 dark:text-gray-300">{headline}</Text>
          )}

          {about && (
            <Text className="block text-xs! text-gray-400! dark:text-gray-300">{about}</Text>
          )}

          {address && (
            <div className="flex items-center gap-1 pt-3!">
              <MapPin size={14} className="text-racing-red-500 dark:text-racing-red-300" />
              <Text type="secondary" className="flex items-center gap-1 text-xs!">
                {address.city}, {address.state}, {address.country}
              </Text>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
