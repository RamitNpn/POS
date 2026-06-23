"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const env = {
    PORT: process.env.PORT ? parseInt(process.env.PORT) : 4000,
    JWT_SECRET: process.env.JWT_SECRET || "d3ea38ea8fbbd2545890fc0ccce45be60d9c0c1df4b8bc6a2d42259613e83b9c60b0c98fdbed5e25c5e1c07428957362e0ec72377f65e50a149062b79750238b",
    MONGO_URI: process.env.MONGO_URI ||
        "mongodb+srv://gauravkarki0927:gauravkarki0927@cluster0.lp3l6vb.mongodb.net/local-vibes?appName=Cluster0",
    DB_NAME: process.env.DB_NAME || "local-vibes",
    frontend_url: process.env.FRONTEND_URL || "https://localvibes.cornortech.com",
    cloud_name: process.env.CLOUD_NAME || "dslzx6qks",
    api_key: process.env.API_KEY || "619242651474882",
    api_secret: process.env.API_SECRET || "Bfx5e7n0jx9daRq_D0rfPpUWzPc",
    NODE_ENV: process.env.NODE_ENV || "production"
};
exports.default = env;
