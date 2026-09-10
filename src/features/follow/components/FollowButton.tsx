import { Button, message } from "antd";
import { UserPlus, UserCheck } from "lucide-react";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { useFollowStatus } from "../hooks/useFollowStatus";
import { useFollowUser, useUnfollowUser } from "../hooks/useFollowMutations";
import { getErrorMessage } from "@/utils/getErrorMessage";

interface FollowButtonProps {
  targetUserId: string;
}

export default function FollowButton({ targetUserId }: FollowButtonProps) {
  const { auth } = useAuth();
  const { data: isFollowing, isLoading } = useFollowStatus(targetUserId);
  const followMutation = useFollowUser();
  const unfollowMutation = useUnfollowUser();

  // Never render a follow button on your own profile.
  if (auth.user?.id === targetUserId) return null;

  const handleClick = async () => {
    try {
      if (isFollowing) {
        await unfollowMutation.mutateAsync(targetUserId);
      } else {
        await followMutation.mutateAsync(targetUserId);
      }
    } catch (error) {
      message.error(getErrorMessage(error, "Something went wrong. Please try again."));
    }
  };

  return (
    <Button
      type={isFollowing ? "default" : "primary"}
      icon={isFollowing ? <UserCheck size={16} /> : <UserPlus size={16} />}
      loading={isLoading || followMutation.isPending || unfollowMutation.isPending}
      onClick={handleClick}
      className="rounded-xl font-semibold"
    >
      {isFollowing ? "Following" : "Follow"}
    </Button>
  );
}
