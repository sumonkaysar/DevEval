/* eslint-disable no-console */
import Redis from "ioredis";
import { env } from "./env.config";

export const redisClient = new Redis({
  username: env.REDIS_USER,
  password: env.REDIS_PASS,
  host: env.REDIS_HOST,
  port: Number(env.REDIS_PORT),
  retryStrategy(times) {
    const delay = Math.min(times * 50, 2000);
    return delay;
  },
});

redisClient.on("error", (err) => console.log("Redis Client Error", err));

export const connectRedis = async () => {
  if (redisClient.status !== "ready" && redisClient.status !== "connecting") {
    await redisClient.connect();
    console.log("Redis connected");
  } else if (redisClient.status === "ready") {
    console.log("Redis already connected");
  }
};
