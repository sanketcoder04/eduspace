export interface FollowStats {
  userId: string;
  followersCount: number;
  followingCount: number;
}

export interface FollowedUser {
  userId: string;
  name: string;
  avatarUrl?: string;
  role: "TEACHER" | "STUDENT";
  followedAt: string;
}
