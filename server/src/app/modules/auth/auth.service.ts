import { compare } from "bcryptjs";
import { StatusCodes } from "http-status-codes";
import { JwtPayload } from "jsonwebtoken";
import { models } from "../../../prisma/db";
import { AppError } from "../../errors/AppError";
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

const getNewAccessToken = async (refreshToken: string) => {
  const accessToken = await createNewAccessTokenWithRefreshToken(refreshToken);
  return { accessToken };
};

export const AuthServices = {
  registerUser,
  credentialsLogin,
  changePassword,
  getNewAccessToken,
};
