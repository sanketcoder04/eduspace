import { createContext, useContext, type PropsWithChildren } from "react";
import { useChatSocket } from "../hooks/useChatSocket";
import type { ConnectionState } from "../services/chatSocket";
import type { ChatSocket } from "../services/chatSocket";

interface ChatSocketContextValue {
  connectionState: ConnectionState;
  getSocket: () => ChatSocket | null;
}

const ChatSocketContext = createContext<ChatSocketContextValue | undefined>(undefined);

export function ChatSocketProvider({ children }: PropsWithChildren) {
  const value = useChatSocket();
  return <ChatSocketContext.Provider value={value}>{children}</ChatSocketContext.Provider>;
}

export function useChatSocketContext() {
  const context = useContext(ChatSocketContext);
  if (!context) {
    throw new Error("useChatSocketContext must be used inside ChatSocketProvider");
  }
  return context;
}
