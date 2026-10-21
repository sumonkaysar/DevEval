import express, { Application, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

const app: Application = express();

app.get("/", (_req: Request, res: Response) => {
  res.status(StatusCodes.OK).json({
    message: "DevEval server is on: 😎",
  });
});

export default app;
