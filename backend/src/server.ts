import dotenv from "dotenv";
import { connectDB } from "./config/db.config";
import app from "./app";
import "../src/config/nodeCorn";
dotenv.config();

const PORT = process.env.PORT || 4000;

const startServer = async () => {
  await connectDB();

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};

startServer();