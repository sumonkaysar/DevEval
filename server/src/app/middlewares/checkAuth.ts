import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { JwtPayload } from "jsonwebtoken";
import { models } from "../../prisma/db";
import { env } from "../config/env.config";
import { AppError } from "../errors/AppError";
import { Role } from "../modules/user/user.type";
import { verifyToken } from "../utils/jwt";

const checkAuth = (...roles: Role[]) => {
  return async (req: Request, _res: Response, next: NextFunction) => {
    try {
      const accessToken = req.cookies.accessToken || req.headers.authorization;

      if (!accessToken) {
        throw new AppError(StatusCodes.UNAUTHORIZED, "You are unauthorized");
      }

      const decoded = verifyToken(
        accessToken,
        env.ACCESS_TOKEN_SECRET,
      ) as JwtPayload;

      const isUserExist = await models.User.where({
        id: decoded.id,
      }).first();

      if (!isUserExist) {
        throw new AppError(StatusCodes.BAD_REQUEST, "User does not exist");
      }

      if (roles.length > 0 && !roles.includes(isUserExist.role as Role)) {
        throw new AppError(StatusCodes.FORBIDDEN, "You are forbidden");
      }

      req.user = decoded;
      next();
    } catch (error) {
      next(error);
    }
  };
};

export default checkAuth;
