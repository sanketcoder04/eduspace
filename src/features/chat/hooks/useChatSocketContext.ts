import { useContext } from "react";
import { ChatSocketContext } from "../context/chatSocketContextInstance";

export function useChatSocketContext() {
  const context = useContext(ChatSocketContext);
  if (!context) {
    throw new Error("useChatSocketContext must be used inside ChatSocketProvider");
  }
  return context;
}
