import type { PropsWithChildren } from "react";
import { useEffect, useMemo, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
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
  const queryClient = useQueryClient();

  const [auth, setAuth] = useState<AuthState>({
    isAuthenticated: !!tokenService.getAccessToken(),
    accessToken: tokenService.getAccessToken(),
    user: null,
  });

  const hasToken = !!auth.accessToken;
  const {
    data: currentUser,
    isFetched,
    isError,
    error: currentUserError,
  } = useCurrentUser(hasToken);

  useEffect(() => {
    if (!hasToken) return;

    if (currentUser) {
      setAuth((prev) => ({ ...prev, isAuthenticated: true, user: toUser(currentUser) }));
    } else if (isFetched && isError) {
      const status = (currentUserError as { response?: { status?: number } })?.response?.status;

      if (status === 401) {
        tokenService.removeAccessToken();
        tokenService.removeRefreshToken();
        queryClient.clear();
        setAuth({ isAuthenticated: false, accessToken: null, user: null });
      }
    }
  }, [currentUser, isFetched, isError, currentUserError, hasToken, queryClient]);

  useEffect(() => {
    return authEvents.subscribe((accessToken) => {
      if (!accessToken) {
        queryClient.clear();
      }
      setAuth((prev) => ({
        ...prev,
        accessToken,
        isAuthenticated: !!accessToken,
        user: accessToken ? prev.user : null,
      }));
    });
  }, [queryClient]);

  const login = (accessToken: string, refreshToken: string, user: User) => {
    queryClient.clear();
    tokenService.setAccessToken(accessToken);
    tokenService.setRefreshToken(refreshToken);
    setAuth({ isAuthenticated: true, accessToken, user });
  };

  const logout = () => {
    tokenService.removeAccessToken();
    tokenService.removeRefreshToken();
    setAuth({ isAuthenticated: false, accessToken: null, user: null });
    queryClient.clear();
  };

  const updateUser = (user: User) => setAuth((prev) => ({ ...prev, user }));
  const syncAccessToken = (accessToken: string | null) =>
    setAuth((prev) => ({ ...prev, accessToken, isAuthenticated: !!accessToken }));

  const isBootstrapping = hasToken && !isFetched;

  const value = useMemo(
    () => ({ auth, isBootstrapping, login, logout, updateUser, syncAccessToken }),
    [auth, isBootstrapping]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
