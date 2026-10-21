import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { AppError } from "../../errors/AppError";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { setAuthCookies } from "../../utils/setCookies";
import { AuthServices } from "./auth.service";

const registerUser = catchAsync(async (req: Request, res: Response) => {
  const result = await AuthServices.registerUser(req.body);

  sendResponse(res, {
    statusCode: StatusCodes.CREATED,
    success: true,
    message: "User registered successfully",
    data: result,
  });
});

const credentialsLogin = catchAsync(async (req: Request, res: Response) => {
  const result = await AuthServices.credentialsLogin(req.body);

  setAuthCookies(res, result);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "User logged in successfully",
    data: result,
  });
});

const logout = catchAsync(async (_req: Request, res: Response) => {
  res.clearCookie("accessToken", {
    httpOnly: true,
    secure: true,
    sameSite: "none",
  });

  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: true,
    sameSite: "none",
  });

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "User logged out successfully",
    data: null,
  });
});

const changePassword = catchAsync(async (req: Request, res: Response) => {
  const decoded = req.user;

  await AuthServices.changePassword(
    decoded,
    req.body.newPassword,
    req.body.oldPassword,
  );

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Password changed successfully",
    data: null,
  });
});

const forgotPassword = catchAsync(async (req: Request, res: Response) => {
  const result = await AuthServices.forgotPassword(req.body.email);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Email sent successfully",
    data: result,
  });
});

const resetPassword = catchAsync(async (req: Request, res: Response) => {
  const result = await AuthServices.resetPassword(req.body);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Password reset successfully",
    data: result,
  });
});

const getNewAccessToken = catchAsync(async (req: Request, res: Response) => {
  const { refreshToken } = req.cookies;

  if (!refreshToken) {
    throw new AppError(StatusCodes.BAD_REQUEST, "No refresh token received");
  }

  const result = await AuthServices.getNewAccessToken(refreshToken);

  setAuthCookies(res, result);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "New access token retrieved succesfully",
    data: result,
  });
});

export const AuthControllers = {
  registerUser,
  credentialsLogin,
  logout,
  changePassword,
  forgotPassword,
  resetPassword,
  getNewAccessToken,
};
