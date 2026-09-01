import { useCallback, useEffect, useRef, useState } from "react";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { ChatSocket, type ConnectionState } from "../services/chatSocket";

const RECONNECT_DELAYS_MS = [1000, 2000, 5000, 10000, 15000]; // capped backoff, last value repeats

/**
 * Owns exactly one ChatSocket for the whole app — mount this once, high in
 * the tree (see ChatSocketProvider below), not per-conversation-page, so
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

  useEffect(() => {
    if (!auth.isAuthenticated || !auth.accessToken) {
      socketRef.current?.disconnect();
      socketRef.current = null;
      setConnectionState("disconnected");
      clearReconnectTimer();
      return;
    }

    const socket = new ChatSocket({
      onStateChange: (state) => {
        setConnectionState(state);
        if (state === "connected") {
          reconnectAttemptRef.current = 0; // reset backoff on a successful connect
          clearReconnectTimer();
        } else if (state === "disconnected") {
          scheduleReconnect();
        }
      },
    });

    socketRef.current = socket;
    socket.connect();

    return () => {
      clearReconnectTimer();
      socket.disconnect();
      socketRef.current = null;
    };
    // Re-runs on token change too — e.g. after a silent refresh cycle, or
    // right after login, when the previous effect's socket had no token yet.
  }, [auth.isAuthenticated, auth.accessToken, scheduleReconnect, clearReconnectTimer]);

  return {
    connectionState,
    getSocket: () => socketRef.current,
  };
}
