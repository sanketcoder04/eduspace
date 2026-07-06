import type { PropsWithChildren } from "react";
import { useMemo, useState } from "react";
import { AuthContext } from "./AuthContext";
import { tokenService } from "../services/token.service";
import type { AuthState } from "../types/auth.types";
import type { User } from "../types/user.types";

export function AuthProvider({ children }: PropsWithChildren) {
  const [auth, setAuth] = useState<AuthState>({
    isAuthenticated: !!tokenService.getAccessToken(),
    accessToken: tokenService.getAccessToken(),
    user: null,
  });

  const login = (accessToken: string, user: User) => {
    tokenService.setAccessToken(accessToken);

    setAuth({
      isAuthenticated: true,
      accessToken,
      user,
    });
  };

  const logout = () => {
    tokenService.removeAccessToken();

    setAuth({
      isAuthenticated: false,
      accessToken: null,
      user: null,
    });
  };

  const updateUser = (user: User) => {
    setAuth((prev) => ({
      ...prev,
      user,
    }));
  };

  const value = useMemo(
    () => ({
      auth,
      login,
      logout,
      updateUser,
    }),
    [auth]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
