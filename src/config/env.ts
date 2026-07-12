import dotenv from "dotenv";
dotenv.config();

function required(name: string): string {
  const value = process.env[name];
  if (!value) throw new Error(`Missing required env variable: ${name}`);
  return value;
}

export const env = {
  MONGODB_URI: required("MONGODB_URI"),
  JWT_SECRET: required("JWT_SECRET"),
  IMGBB_API_KEY: required("IMGBB_API_KEY"),
  CLIENT_URL: process.env.CLIENT_URL || "http://localhost:3000",
  PORT: process.env.PORT || 5000,
};
