import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

export const notFound = (_req: Request, res: Response) => {
  res.status(StatusCodes.NOT_FOUND).json({
    success: false,
    message: "API Not Found!",
    err: null,
  });
};
