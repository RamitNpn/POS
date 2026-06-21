import dotenv from "dotenv";
import { connectDB } from "./config/db.config";
import app from "./app";
import http from "http";
import { initializeSocket } from "./utils/socket";
import "../src/config/nodeCorn";
dotenv.config();

const PORT = process.env.PORT || 4000;

const startServer = async () => {
  await connectDB();

  const server = http.createServer(app);
  initializeSocket(server);

  server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};

startServer();