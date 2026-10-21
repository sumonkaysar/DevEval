import Redis from "ioredis";
import { env } from "../config/env.config";

const redis = new Redis(env.REDIS_URL);

redis.on("connect", () => {
  console.log("Connected to Redis successfully");
});

redis.on("error", (err) => {
  console.error("Redis connection error:", err);
});

export default redis;
