import type { Role } from "@/features/auth/types/user.types";
import type { SliceResponse } from "@/types/api.types";

export interface UserSearchResult {
  userId: string;
  name: string;
  role: Role;
  avatarUrl?: string;
  following: boolean;
}

export type SearchPage = SliceResponse<UserSearchResult>;
