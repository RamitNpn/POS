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
    "mongodb+srv://gauravkarki0927:gauravkarki0927@cluster0.lp3l6vb.mongodb.net/local-vibes?appName=Cluster0",
  DB_NAME: process.env.DB_NAME || "local-vibes",
  frontend_url: process.env.FRONTEND_URL || "https://localvibes.cornortech.com",
  cloud_name: process.env.CLOUD_NAME || "dvl63bq6z",
  api_key: process.env.API_KEY || "823567279581777",
  api_secret: process.env.API_SECRET || "G0GoDOQK8qUoQt94rPRCtvDom-E",
  NODE_ENV: process.env.NODE_ENV || "production"
};

export default env;