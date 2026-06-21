import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import { contract } from "./contract";
import swaggerUi from "swagger-ui-express";
import { createExpressEndpoints } from "@ts-rest/express";
import morgan from "morgan";
import { openApiDocument } from "./config/swagger.config";
import { router } from "./module";
import env from "./config/env";

const app = express();

const corsOptions = {
  origin: [
    env.frontend_url || "http://localhost:3000",
  ],
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

app.use("/dineflow-api", swaggerUi.serve, swaggerUi.setup(openApiDocument));

createExpressEndpoints(contract, router, app);
export default app;
