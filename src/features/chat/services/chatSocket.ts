import { Client, type IMessage, type StompSubscription } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import { ENV } from "@/config/env";
import { tokenService } from "@/features/auth/services/token.service";

export type ConnectionState = "disconnected" | "connecting" | "connected";

interface ChatSocketCallbacks {
  onStateChange: (state: ConnectionState) => void;
}

/**
 * Thin wrapper around @stomp/stompjs's Client, isolated from React entirely
 * so it can be unit-tested and so useChatSocket (the React-facing hook) stays
 * focused on lifecycle wiring rather than STOMP mechanics.
 *
 * Auth: the JWT goes on the STOMP CONNECT frame's native headers (via
 * connectHeaders), matching StompAuthChannelInterceptor on the backend —
 * NOT a query param or the SockJS handshake, since that's the one place
 * a bearer token can travel identically over native WS and SockJS fallback.
 */
export class ChatSocket {
  private client: Client | null = null;
  private callbacks: ChatSocketCallbacks;

  constructor(callbacks: ChatSocketCallbacks) {
    this.callbacks = callbacks;
  }

  connect(): void {
    if (this.client?.active) return;

    const accessToken = tokenService.getAccessToken();

    if (!accessToken) {
      // No point opening a socket the server will immediately reject —
      // the caller (useChatSocket) re-invokes connect() once a token exists.
      return;
    }

    this.callbacks.onStateChange("connecting");

    this.client = new Client({
      webSocketFactory: () => new SockJS(`${ENV.WS_BASE_URL}/ws`),
      connectHeaders: {
        Authorization: `Bearer ${accessToken}`,
      },
      reconnectDelay: 0, // manual backoff below — the default's flat retry doesn't handle "token just expired" well
      onConnect: () => this.callbacks.onStateChange("connected"),
      onDisconnect: () => this.callbacks.onStateChange("disconnected"),
      onWebSocketClose: () => this.callbacks.onStateChange("disconnected"),
      onStompError: () => this.callbacks.onStateChange("disconnected"),
    });

    this.client.activate();
  }

  disconnect(): void {
    this.client?.deactivate();
    this.client = null;
    this.callbacks.onStateChange("disconnected");
  }

  get isConnected(): boolean {
    return this.client?.connected ?? false;
  }

  subscribe<T>(destination: string, handler: (payload: T) => void): StompSubscription | null {
    if (!this.client?.connected) return null;

    return this.client.subscribe(destination, (message: IMessage) => {
      try {
        handler(JSON.parse(message.body) as T);
      } catch {
        // Malformed frame — drop it rather than crash the subscription.
      }
    });
  }

  publish(destination: string, body: unknown): void {
    if (!this.client?.connected) return;
    this.client.publish({ destination, body: JSON.stringify(body) });
  }
}
