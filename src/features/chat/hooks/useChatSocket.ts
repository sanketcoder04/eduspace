import { useCallback, useEffect, useRef, useState } from "react";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { ChatSocket, type ConnectionState } from "../services/chatSocket";

const RECONNECT_DELAYS_MS = [1000, 2000, 5000, 10000, 15000]; // capped backoff, last value repeats

/**
 * Owns exactly one ChatSocket for the whole app — mount this once, high in
 * the tree (see ChatSocketProvider), not per-conversation-page, so
 * navigating between chat pages doesn't tear down and reopen the connection.
 */
export function useChatSocket() {
  const { auth } = useAuth();
  const socketRef = useRef<ChatSocket | null>(null);
  const reconnectAttemptRef = useRef(0);
  const reconnectTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [connectionState, setConnectionState] = useState<ConnectionState>("disconnected");

  const clearReconnectTimer = useCallback(() => {
    if (reconnectTimerRef.current) {
      clearTimeout(reconnectTimerRef.current);
      reconnectTimerRef.current = null;
    }
  }, []);

  const scheduleReconnect = useCallback(() => {
    clearReconnectTimer();
    const delay =
      RECONNECT_DELAYS_MS[Math.min(reconnectAttemptRef.current, RECONNECT_DELAYS_MS.length - 1)];
    reconnectAttemptRef.current += 1;

    reconnectTimerRef.current = setTimeout(() => {
      socketRef.current?.connect();
    }, delay);
  }, [clearReconnectTimer]);

  // The ONLY place connectionState is ever set. Every setState call in this
  // hook now happens inside this callback — reacting to an external event
  // (the socket's own lifecycle), never as a bare statement in an effect
  // body — which is exactly the distinction the lint rule is checking for.
  const handleSocketStateChange = useCallback(
    (state: ConnectionState) => {
      setConnectionState(state);
      if (state === "connected") {
        reconnectAttemptRef.current = 0; // reset backoff on a successful connect
        clearReconnectTimer();
      } else if (state === "disconnected") {
        scheduleReconnect();
      }
    },
    [scheduleReconnect, clearReconnectTimer]
  );

  useEffect(() => {
    if (!auth.isAuthenticated || !auth.accessToken) {
      clearReconnectTimer();
      // If a socket exists from a previous session, tearing it down here
      // still only ever calls setState via handleSocketStateChange above —
      // never a direct setConnectionState(...) statement in this effect.
      socketRef.current?.disconnect();
      socketRef.current = null;
      return;
    }

    const socket = new ChatSocket({ onStateChange: handleSocketStateChange });
    socketRef.current = socket;
    socket.connect();

    return () => {
      clearReconnectTimer();
      socket.disconnect();
      socketRef.current = null;
    };
    // Re-runs on token change too — e.g. after a silent refresh cycle, or
    // right after login, when the previous effect's socket had no token yet.
  }, [auth.isAuthenticated, auth.accessToken, clearReconnectTimer, handleSocketStateChange]);

  return {
    connectionState,
    getSocket: () => socketRef.current,
  };
}
