import type { User } from "./user.types";

export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  accessToken: string | null;
}
