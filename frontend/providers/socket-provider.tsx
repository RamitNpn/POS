import { socket } from "../utils/socket";
import { createContext, useMemo } from "react";
import { useSocketListeners } from "../hooks/use-socket-listeners";

export const SocketContext = createContext(socket);

export const SocketProvider = ({ children }: { children: React.ReactNode }) => {
  // Setup socket listeners (only once due to global flag)
  useSocketListeners();

  // Memoize provider value to prevent unnecessary re-renders
  const value = useMemo(() => socket, []);

  return (
    <SocketContext.Provider value={value}>{children}</SocketContext.Provider>
  );
};
