import { createContext } from "react";
import type { AuthState } from "../types/auth.types";
import type { User } from "../types/user.types";

export interface AuthContextType {
  auth: AuthState;
  isBootstrapping: boolean;
  login: (accessToken: string, refreshToken: string, user: User) => void;
  logout: () => void;
  updateUser: (user: User) => void;
  syncAccessToken: (accessToken: string | null) => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);
