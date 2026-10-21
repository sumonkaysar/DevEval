import { StatusCodes } from "http-status-codes";
import { JwtPayload } from "jsonwebtoken";
import { models } from "../../prisma/db";
import { env } from "../config/env.config";
import { AppError } from "../errors/AppError";
import { TUser } from "../modules/user/user.type";
import { generateToken, verifyToken } from "./jwt";

export const createUserTokens = async (user: TUser) => {
  const jwtPayload = {
    userId: user.id,
    email: user.email,
    role: user.role,
  };

  const accessToken = generateToken(
    jwtPayload,
    env.ACCESS_TOKEN_SECRET,
    env.ACCESS_TOKEN_EXPIRES_IN,
  );

  const refreshToken = generateToken(
    jwtPayload,
    env.REFRESH_TOKEN_SECRET,
    env.REFRESH_TOKEN_EXPIRES_IN,
  );

  return { accessToken, refreshToken };
};

export const createNewAccessTokenWithRefreshToken = async (
  refreshToken: string,
) => {
  const verifiedRefreshToken = verifyToken(
    refreshToken,
    env.REFRESH_TOKEN_SECRET,
  ) as JwtPayload;

  const isUserExist = await models.User.where({
    email: verifiedRefreshToken.email,
  }).first();

  if (!isUserExist) {
    throw new AppError(StatusCodes.BAD_REQUEST, "User not exists");
  }

  const jwtPayload = {
    userId: isUserExist.id,
    email: isUserExist.email,
    role: isUserExist.role,
  };

  const accessToken = generateToken(
    jwtPayload,
    env.ACCESS_TOKEN_SECRET,
    env.ACCESS_TOKEN_EXPIRES_IN,
  );

  return accessToken;
};
