import { createContext } from "react";
import type { ConnectionState, ChatSocket } from "../services/chatSocket";

export interface ChatSocketContextValue {
  connectionState: ConnectionState;
  getSocket: () => ChatSocket | null;
}

export const ChatSocketContext = createContext<ChatSocketContextValue | undefined>(undefined);
