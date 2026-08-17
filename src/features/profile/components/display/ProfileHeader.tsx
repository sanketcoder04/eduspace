import { Typography, Button } from "antd";
import { Pencil, MapPin } from "lucide-react";
import VerificationBadge from "./VerificationBadge";
import AvatarUpload from "../shared/AvatarUpload";
import type { Address, VerificationStatus } from "../../types/profile.types";
import CoverPhotoUpload from "../shared/CoverPhotoUpload";

const { Title, Text } = Typography;

interface ProfileHeaderProps {
  name: string;
  headline?: string;
  avatarUrl?: string;
  coverImageUrl?: string;
  address?: Address;
  verificationStatus: VerificationStatus;
  isOwner: boolean;
  onAvatarChange?: (url: string) => void;
  onCoverChange?: (url: string) => void;
  onEditProfile?: () => void;
  showCover?: boolean;
}

export default function ProfileHeader({
  name,
  headline,
  avatarUrl,
  coverImageUrl,
  address,
  verificationStatus,
  isOwner,
  onAvatarChange,
  onCoverChange,
  onEditProfile,
  showCover = true,
}: ProfileHeaderProps) {
  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
      {showCover && (
        <CoverPhotoUpload
          value={coverImageUrl}
          onChange={(url) => onCoverChange?.(url)}
          isOwner={isOwner}
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
          {isOwner ? (
            <AvatarUpload value={avatarUrl} onChange={(url) => onAvatarChange?.(url)} size={96} />
          ) : (
            <div className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-full border-4 border-white bg-gray-200 text-2xl font-semibold text-gray-500 shadow-md dark:border-neutral-900">
              {avatarUrl ? (
                <img src={avatarUrl} alt={name} className="h-full w-full object-cover" />
              ) : (
                name?.charAt(0)
              )}
            </div>
          )}

          {isOwner && (
            <Button icon={<Pencil size={14} />} onClick={onEditProfile} className="mb-2 rounded-xl">
              <span className="hidden sm:inline">Edit profile</span>
            </Button>
          )}
        </div>

        <div className="mt-4 space-y-1">
          <div className="flex flex-wrap items-center gap-2">
            <Title level={3} className="mb-0!">
              {name}
            </Title>
            <VerificationBadge status={verificationStatus} />
          </div>

          {headline && (
            <Text className="block text-base text-gray-600 dark:text-gray-300">{headline}</Text>
          )}

          {address && (
            <div className="flex items-center gap-1">
              <MapPin size={14} className="text-racing-red-500 dark:text-racing-red-300" />
              <Text type="secondary" className="flex items-center gap-1 text-sm">
                {address.city}, {address.state}, {address.country}
              </Text>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
