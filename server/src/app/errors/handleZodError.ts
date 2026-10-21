import { StatusCodes } from "http-status-codes";
import { ZodError } from "zod";
import { TErrorSources, TGenericErrorResponse } from "../types/error.types";

export const handleZodError = (err: ZodError): TGenericErrorResponse => {
  const errorSources = err.issues.map(({ path, message }) => ({
    path: path[path.length - 1],
    message,
  })) as TErrorSources[];

  return {
    statusCode: StatusCodes.BAD_REQUEST,
    message: "Zod validation error",
    errorSources: errorSources,
  };
};
