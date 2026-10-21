/* eslint-disable no-console */
import { Server } from "http";
import "temporal-polyfill/full/global";
import app from "./app";
import { env } from "./app/config/env.config";
import { connectRedis } from "./app/config/redis.config";
import { seedAdmin } from "./app/utils/seedAdmin";
import { db } from "./prisma/db";

let server: Server;

const main = async () => {
  try {
    await db.connect();
    console.log("Database connected successfully");

    server = app.listen(env.PORT, () => {
      console.log(`Server is on port ${env.PORT}`);
    });
  } catch (err) {
    console.log(err);
    process.exit(1);
  }
};

(async () => {
  await connectRedis();
  await main();
  await seedAdmin();
})();

const gracefulShutdown = async (message: string, err?: unknown) => {
  console.log(message, err);

  if (server) {
    server.close(() => {
      console.log("😈 Server is closed");
      process.exit(1);
    });
  }
  process.exit(1);
};

// Unhandled Rejection Error
process.on("unhandledRejection", (err) =>
  gracefulShutdown(
    `😈 Unhandled Rejection is detected, server is shutting down ...`,
    err,
  ),
);

// Uncaught Rejection Error
process.on("uncaughtException", (err) =>
  gracefulShutdown(
    `😈 Uncaught Exception is detected, server is shutting down ...`,
    err,
  ),
);

// SIGTERM
process.on("SIGTERM", () =>
  gracefulShutdown("😈 SIGTERM signal received, server is shutting down ..."),
);

// SIGINT
process.on("SIGINT", () =>
  gracefulShutdown("😈 SIGINT signal received, server is shutting down ..."),
);
