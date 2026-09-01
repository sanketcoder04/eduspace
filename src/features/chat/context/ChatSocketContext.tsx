import type { PropsWithChildren } from "react";
import { useChatSocket } from "../hooks/useChatSocket";
import { ChatSocketContext } from "./chatSocketContextInstance";

export function ChatSocketProvider({ children }: PropsWithChildren) {
  const value = useChatSocket();
  return <ChatSocketContext.Provider value={value}>{children}</ChatSocketContext.Provider>;
}
