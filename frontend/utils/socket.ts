import { io } from "socket.io-client";

const SOCKET_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:4000";

export const socket = io(SOCKET_URL, {
  withCredentials: true,
  autoConnect: false,
});

// Expose socket to window for debugging
if (typeof window !== "undefined") {
  (window as any).__POS_SOCKET__ = socket;
  (window as any).__POS_DEBUG__ = {
    checkSocket: () => {
      console.log("📊 Socket Debug Info:");
      console.log("  Connected:", socket.connected);
      console.log("  Disconnected:", socket.disconnected);
      console.log("  ID:", socket.id);
      console.log("  URL:", SOCKET_URL);
      console.log("  Socket object:", socket);
      return { connected: socket.connected, id: socket.id, url: SOCKET_URL };
    },
    connect: () => {
      console.log("🔄 Manually connecting socket...");
      socket.connect();
    },
    disconnect: () => {
      console.log("🔌 Manually disconnecting socket...");
      socket.disconnect();
    },
    testEmit: (event: string, data: any) => {
      console.log("📤 Testing emit of event:", event, "with data:", data);
      socket.emit(event, data);
    },
  };
  console.log("🔧 Socket exposed to window.__POS_SOCKET__ for debugging");
  console.log("🔧 Debug commands available via window.__POS_DEBUG__");
}

// Add connection event listeners for debugging
socket.on("connect", () => {
  console.log("✅ Socket connected:", socket.id);
});

socket.on("disconnect", (reason) => {
  console.log("❌ Socket disconnected:", reason);
});

socket.on("connect_error", (error) => {
  console.error("🔴 Socket connection error:", error);
});

socket.on("error", (error) => {
  console.error("🔴 Socket error:", error);
});

// Log ALL incoming events (for debugging)
socket.onAny((event, ...args) => {
  if (!event.startsWith("connect") && !event.startsWith("disconnect")) {
    console.log("📨 Socket event received:", event, args);
  }
});
