import jwt from "jsonwebtoken";
import { NextFunction, Request, Response } from "express";

import { TOKEN_SECRET } from "../variables";

export const authenticateToken = (
  req: Request,
  res: Response,
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
