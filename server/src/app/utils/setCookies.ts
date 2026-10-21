import { Response } from "express";

type AuthTokens = {
  accessToken?: string;
  refreshToken?: string;
};

export const setAuthCookies = (res: Response, tokens: AuthTokens) => {
  if (tokens.accessToken) {
    res.cookie("accessToken", tokens.accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
    });
  }

  if (tokens.refreshToken) {
    res.cookie("refreshToken", tokens.refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
    });
  }
};
