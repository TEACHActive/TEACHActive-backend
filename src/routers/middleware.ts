import jwt from "jsonwebtoken";
import { NextFunction, Request, Response as ExpressResponse } from "express";

import { TOKEN_SECRET } from "../variables";
import { userOwnsSession } from "./engine";
import { TokenSign } from "./user/types";
import { Response } from "./types";

export const authenticateToken = (
  req: Request,
  res: ExpressResponse,
  next: NextFunction
) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) return res.sendStatus(401);

  jwt.verify(token, TOKEN_SECRET as string, (err, user: any) => {
    if (err) {
      console.log(err);
      return res.sendStatus(403);
    }
    req.user = user;
    next();
  });
};

export const checkIfUserOwnsSession = async (
  req: Request,
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
