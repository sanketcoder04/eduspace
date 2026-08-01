// src/features/auth/context/AuthProvider.tsx
import type { PropsWithChildren } from "react";
import { useEffect, useMemo, useState } from "react";
import { AuthContext } from "./AuthContext";
import { tokenService } from "../services/token.service";
import { authEvents } from "../services/authEvents";
import { useCurrentUser } from "../hooks/useCurrentUser";
import type { AuthState } from "../types/auth.types";
import type { User } from "../types/user.types";
import type { UserResponse } from "../types/auth.types";

function toUser(response: UserResponse): User {
  return { id: response.id, email: response.email, role: response.role };
}

export function AuthProvider({ children }: PropsWithChildren) {
  const [auth, setAuth] = useState<AuthState>({
    isAuthenticated: !!tokenService.getAccessToken(),
    accessToken: tokenService.getAccessToken(),
    user: null,
  });

  const hasToken = !!auth.accessToken;
  const { data: currentUser, isFetched, isError } = useCurrentUser(hasToken);

  // Hydrate auth.user once /me resolves (covers page reload)
  useEffect(() => {
    if (!hasToken) return;

    if (currentUser) {
      setAuth((prev) => ({
        ...prev,
        isAuthenticated: true,
        user: toUser(currentUser),
      }));
    } else if (isFetched && isError) {
      // token invalid/expired and refresh already failed upstream
      tokenService.removeAccessToken();
      tokenService.removeRefreshToken();
      setAuth({ isAuthenticated: false, accessToken: null, user: null });
    }
  }, [currentUser, isFetched, isError, hasToken]);

  // Stay in sync with silent refreshes / forced logouts from the axios interceptor
  useEffect(() => {
    return authEvents.subscribe((accessToken) => {
      setAuth((prev) => ({
        ...prev,
        accessToken,
        isAuthenticated: !!accessToken,
        user: accessToken ? prev.user : null,
      }));
    });
  }, []);

  const login = (accessToken: string, refreshToken: string, user: User) => {
    tokenService.setAccessToken(accessToken);
    tokenService.setRefreshToken(refreshToken);
    setAuth({ isAuthenticated: true, accessToken, user });
  };

  const logout = () => {
    tokenService.removeAccessToken();
    tokenService.removeRefreshToken();
    setAuth({ isAuthenticated: false, accessToken: null, user: null });
  };

  const updateUser = (user: User) => {
    setAuth((prev) => ({ ...prev, user }));
  };

  const syncAccessToken = (accessToken: string | null) => {
    setAuth((prev) => ({ ...prev, accessToken, isAuthenticated: !!accessToken }));
  };

  // Bootstrapping = we have a token but haven't confirmed the user yet
  const isBootstrapping = hasToken && !isFetched;

  const value = useMemo(
    () => ({ auth, isBootstrapping, login, logout, updateUser, syncAccessToken }),
    [auth, isBootstrapping]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
