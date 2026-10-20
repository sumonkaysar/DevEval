import express, { Application, Request, Response } from "express";

const app: Application = express();

app.get("/", (_req: Request, res: Response) => {
  res.status(httpStatus.OK).json({
    message: "DevEval server is on: 😎",
  });
});

export default app;
