import jwt from "jsonwebtoken";
import { NextFunction, Response as ExpressResponse } from "express";

import { Response } from "./types";
import { TokenSign } from "./user/types";
import * as Constants from "../variables";
import { userOwnsSession } from "./engine";
import { TOKEN_SECRET } from "../variables";

export const authenticateToken = (
  req: any,
  res: ExpressResponse,
  next: NextFunction
) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) return res.sendStatus(401);

  jwt.verify(token, TOKEN_SECRET as string, (err: any, user: any) => {
    if (err) {
      console.log(err);
      return res.sendStatus(403);
    }
    req.user = user;
    next();
  });
};

export const checkIfUserOwnsSession = async (
  req: any,
  res: ExpressResponse,
  next: NextFunction
) => {
  const { sessionId } = req.params;
  const tokenSign: TokenSign = req.user;

  const ownsSession = await userOwnsSession(sessionId, tokenSign);

  if (!ownsSession) {
    const response = new Response(
      false,
      null,
      401,
      "User does not own this session"
    );
    res.statusCode = response.statusCode;
    res.json(response);
    return;
  }
  next();
};

export const checkIsUserAdmin = async (
  req: any,
  res: ExpressResponse,
  next: NextFunction
) => {
  const { sessionId } = req.params;
  const tokenSign: TokenSign = req.user;

  const isAdminRequest = Constants.ADMIN_LIST.includes(tokenSign.uid);

  if (!isAdminRequest) {
    const response = new Response(false, null, 401, "User is not admin");
    res.statusCode = response.statusCode;
    res.json(response);
    return;
  }
  next();
};
