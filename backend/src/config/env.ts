type TEnv = {
  PORT: number;
  JWT_SECRET: string;
  MONGO_URI: string;
  DB_NAME: string;
  frontend_url: string;
  cloud_name: string;
  api_key: string;
  api_secret: string;
  NODE_ENV: string;
};

const env: TEnv = {
  PORT: process.env.PORT ? parseInt(process.env.PORT) : 4000,
  JWT_SECRET: process.env.JWT_SECRET || "d3ea38ea8fbbd2545890fc0ccce45be60d9c0c1df4b8bc6a2d42259613e83b9c60b0c98fdbed5e25c5e1c07428957362e0ec72377f65e50a149062b79750238b",
  MONGO_URI:
    process.env.MONGO_URI ||
    "mongodb+srv://gauravkarki0927:gauravkarki0927@cluster0.lp3l6vb.mongodb.net/restaurant?appName=Cluster0",
  DB_NAME: process.env.DB_NAME || "restaurant",
  frontend_url: process.env.FRONTEND_URL || "http://localhost:3000",
  cloud_name: process.env.CLOUD_NAME || "dslzx6qks",
  api_key: process.env.API_KEY || "619242651474882",
  api_secret: process.env.API_SECRET || "Bfx5e7n0jx9daRq_D0rfPpUWzPc",
  NODE_ENV: process.env.NODE_ENV || "production"
};

export default env;