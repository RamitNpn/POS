import { Server } from "socket.io";
import http from "http";
import env from "../config/env";

let io: Server;

export const initializeSocket = (server: http.Server) => {
  io = new Server(server, {
    cors: {
      origin: [env.frontend_url || "http://localhost:3000"],
      credentials: true,
    },
    transports: ["websocket", "polling"],
  });

  io.on("connection", (socket) => {
    console.log("✅ User connected:", socket.id, "from", socket.handshake.address);

    socket.on("disconnect", (reason) => {
      console.log("❌ User disconnected:", socket.id, "reason:", reason);
    });

    socket.on("error", (error) => {
      console.error("🔴 Socket error for", socket.id, ":", error);
    });
  });

  // Log socket.io initialization
  console.log("✅ Socket.IO initialized with CORS origin:", env.frontend_url);

  return io;
};

export const getIO = () => {
  if (!io) {
    throw new Error("Socket.IO not initialized");
  }

  return io;
};
