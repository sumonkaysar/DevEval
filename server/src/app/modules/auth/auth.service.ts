import { compare, hash } from "bcryptjs";
import crypto from "crypto";
import { StatusCodes } from "http-status-codes";
import { JwtPayload } from "jsonwebtoken";
import { models } from "../../../prisma/db";
import { env } from "../../config/env.config";
import { redisClient } from "../../config/redis.config";
import { urls } from "../../config/url.config";
import { AppError } from "../../errors/AppError";
import { forgotPasswordEmailTemplate } from "../../templates/forgotPasswordTemplate";
import { sendEmail } from "../../utils/sendEmail";
import {
  createNewAccessTokenWithRefreshToken,
  createUserTokens,
} from "../../utils/userTokens";
import { Role, TUser } from "../user/user.type";

const registerUser = async (payload: TUser) => {
  const isUserExist = await models.User.where({ email: payload.email }).first();

  if (isUserExist) {
    throw new AppError(StatusCodes.BAD_REQUEST, "Email already registered");
  }

  if (payload.role === Role.ADMIN) {
    throw new AppError(StatusCodes.BAD_REQUEST, "You can't be Admin");
  }

  payload.password = await hash(
    payload.password,
    Number(env.BCRYPTJS_SALT_ROUND),
  );

  const user = await models.User.create(payload);

  return user;
};

const credentialsLogin = async (payload: TUser) => {
  const isUserExist = await models.User.where({
    email: payload.email,
  }).first();

  if (!isUserExist) {
    throw new AppError(StatusCodes.BAD_REQUEST, "Wrong credentials");
  }

  const isPasswordMatched = await compare(
    payload.password,
    isUserExist.password,
  );

  if (!isPasswordMatched) {
    throw new AppError(StatusCodes.BAD_REQUEST, "Wrong credentials");
  }

  const tokens = await createUserTokens(isUserExist);

  isUserExist.password = "";

  return {
    user: isUserExist,
    ...tokens,
  };
};

const changePassword = async (
  decoded: JwtPayload,
  newPassword: string,
  oldPassword: string,
) => {
  const user = await models.User.where({
    id: decoded.id,
  }).first();

  if (!user) {
    throw new AppError(StatusCodes.NOT_FOUND, "User not found");
  }

  const isOldPasswordMatched = await compare(
    oldPassword,
    user.password as string,
  );

  if (!isOldPasswordMatched) {
    throw new AppError(StatusCodes.BAD_REQUEST, "Old password does not match");
  }

  await models.User.where({ id: user.id }).update({
    password: newPassword,
  });
};

const forgotPassword = async (email: string) => {
  const user = await models.User.where({ email }).first();

  if (!user) {
    throw new AppError(StatusCodes.NOT_FOUND, "User not found");
  }

  const resetToken = crypto.randomBytes(32).toString("hex");

  await redisClient.set(`password-reset:${resetToken}`, user.id, "EX", 3600);

  const resetUrl = `${urls.FRONTEND_URL}/reset-password?token=${resetToken}`;

  await sendEmail({
    to: user.email,
    subject: "DevEval - Password Reset Request",
    html: forgotPasswordEmailTemplate(
      `${user.firstName} ${user.lastName}`,
      resetUrl,
    ),
  });

  return {
    message: "Password reset token sent to email",
  };
};

const resetPassword = async ({
  token,
  newPassword,
}: {
  token: string;
  newPassword: string;
}) => {
  const userId = await redisClient.get(`password-reset:${token}`);

  if (!userId) {
    throw new AppError(
      StatusCodes.BAD_REQUEST,
      "Invalid or expired password reset token.",
    );
  }

  const user = await models.User.where({ id: Number(userId) }).first();

  if (!user) {
    throw new AppError(StatusCodes.NOT_FOUND, "User not found.");
  }

  const hashedPassword = await hash(
    newPassword,
    Number(env.BCRYPTJS_SALT_ROUND),
  );

  await models.User.where({ id: user.id }).update({
    password: hashedPassword,
  });

  await redisClient.del(`password-reset:${token}`);

  return { message: "Password successfully reset." };
};

const getNewAccessToken = async (refreshToken: string) => {
  const accessToken = await createNewAccessTokenWithRefreshToken(refreshToken);
  return { accessToken };
};

export const AuthServices = {
  registerUser,
  credentialsLogin,
  changePassword,
  forgotPassword,
  resetPassword,
  getNewAccessToken,
};
