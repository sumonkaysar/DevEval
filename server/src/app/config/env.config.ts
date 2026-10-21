import dotenv from "dotenv";
dotenv.config();

const envFields = [
  "NODE_ENV",
  "PORT",

  // App Name
  "APP_NAME",

  // Database URL
  "DATABASE_URL",

  // Frontend URL
  "FRONTEND_DEV_URL",
  "FRONTEND_PROD_URL",

  // Backend URL
  "BACKEND_DEV_URL",
  "BACKEND_PROD_URL",

  // super admin
  "ADMIN_FIRST_NAME",
  "ADMIN_LAST_NAME",
  "ADMIN_EMAIL",
  "ADMIN_PASS",

  // bcryptjs
  "BCRYPTJS_SALT_ROUND",

  // JWT
  "ACCESS_TOKEN_SECRET",
  "REFRESH_TOKEN_SECRET",
  "ACCESS_TOKEN_EXPIRES_IN",
  "REFRESH_TOKEN_EXPIRES_IN",

  // SMTP gmail
  "SMTP_HOST",
  "SMTP_PORT",
  "SMTP_USER",
  "SMTP_PASS",

  // redis
  "REDIS_USER",
  "REDIS_PASS",
  "REDIS_PORT",
  "REDIS_HOST",
] as const;

type IEnv = Record<(typeof envFields)[number], string>;

const env = {} as IEnv;
const missingEnvs: string[] = [];

envFields.forEach((key) => {
  const value = process.env[key];
  if (value) {
    env[key as keyof IEnv] = value;
  } else {
    missingEnvs.push(key);
  }
});

// Showing missing envs
const blue = (s: string) => `\x1b[34m${s}\x1b[0m`;
const yellow = (s: string) => `\x1b[33m${s}\x1b[0m`;

if (missingEnvs.length > 0) {
  const err =
    "\n================================\n" +
    yellow(" Missing") +
    " environment variables:" +
    "\n" +
    missingEnvs
      .map((k) => `    ${blue(k)}: ${yellow("undefined")}`)
      .join("\n") +
    "\n================================\n";
  throw new Error(err);
}

export { env };
