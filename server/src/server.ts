/* eslint-disable no-console */
import { Server } from "http";
import app from "./app";

let server: Server;

const main = async () => {
  try {
    server = app.listen(5000, () => {
      console.log(`Server is on port ${5000}`);
    });
  } catch (err) {
    console.log(err);
    process.exit(1);
  }
};

(async () => {
  await main();
})();

// Unhandled Rejection Error
process.on("unhandledRejection", (err) => {
  console.log(
    `😈 Unhandled Rejection is detected, server is shutting down ...`,
    err,
  );

  if (server) {
    server.close(() => {
      process.exit(1);
    });
  }
  process.exit(1);
});

// Uncaught Rejection Error
process.on("uncaughtException", (err) => {
  console.log(
    `😈 Unhandled Exception is detected, server is shutting down ...`,
    err,
  );

  if (server) {
    server.close(() => {
      process.exit(1);
    });
  }
  process.exit(1);
});

// SIGTERM
process.on("SIGTERM", () => {
  console.log("😈 SIGTERM signal received, server is shutting down ...");

  if (server) {
    server.close(() => {
      process.exit(1);
    });
  }
  process.exit(1);
});

// SIGINT
process.on("SIGINT", () => {
  console.log("😈 SIGINT signal received, server is shutting down ...");

  if (server) {
    server.close(() => {
      process.exit(1);
    });
  }
  process.exit(1);
});
