import { env } from "./env.config";

const baseUrls = {
  FRONTEND_URL: env.FRONTEND_DEV_URL,
  BACKEND_URL: env.BACKEND_DEV_URL,
};

if (env.NODE_ENV === "production") {
  baseUrls.FRONTEND_URL = env.FRONTEND_PROD_URL;
  baseUrls.BACKEND_URL = env.BACKEND_PROD_URL;
}

export const urls = {
  ...baseUrls,
};
