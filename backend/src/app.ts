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

app.use(
  cors({
    origin: [
      env.frontend_url || "https://atithi.cornortech.com",
    ],
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("production"));

app.use("/localvibes-api", swaggerUi.serve, swaggerUi.setup(openApiDocument));

createExpressEndpoints(contract, router, app);
export default app;
