import Redis from "ioredis";
import { env } from "./env.config";

export const redis = new Redis(env.REDIS_URL);

redis.on("connect", () => {
  console.log("Connected to Redis successfully");
});

redis.on("error", (err) => {
  console.error("Redis connection error:", err);
});

export const connectRedis = async () => {
  try {
    await redis.ping();
  } catch (error) {
    process.exit(1);
  }
};
