import jwt from "jsonwebtoken";
import { body, param, query } from "express-validator";
import { validationResult } from "express-validator";
import { NextFunction, Response as ExpressResponse } from "express";

import { Response } from "./types";
import { TokenSign } from "./user/types";
import { TOKEN_SECRET } from "../variables";
import { isAdminRequest, userOwnsSession } from "./engine";
import { LimitedDurationUnit } from "./sessions/types";

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

export const ensureUserOwnsSession = async (
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

export const ensureUserIsAdmin = async (
  req: any,
  res: ExpressResponse,
  next: NextFunction
) => {
  const tokenSign: TokenSign = req.user;

  const adminRequest = await isAdminRequest(tokenSign);

  if (!adminRequest) {
    const response = new Response(false, null, 401, "User is not admin");
    res.statusCode = response.statusCode;
    res.json(response);
    return;
  }
  next();
};

export const ensureQueryContains = async (
  req: any,
  res: ExpressResponse,
  next: NextFunction,
  queryParams: string[]
) => {
  const query = req.query;
  let missingQueryParams: string[] = [];
  queryParams.forEach((queryParam) => {
    const queryParamExists = typeof query[queryParam] === "string";
    if (!queryParamExists) {
      missingQueryParams.push(queryParam as string);
    }
  });

  if (missingQueryParams.length > 0) {
    const response = new Response(
      false,
      null,
      400,
      "Missing query params: " + missingQueryParams.join(",")
    );
    res.statusCode = response.statusCode;
    res.json(response);
    return;
  }
  next();
};

export const ensureQueryContainsConstructor = (queryParams: string[]) => {
  return (req: any, res: ExpressResponse, next: NextFunction) =>
    ensureQueryContains(req, res, next, queryParams);
};

export const ensureValidInput = (
  req: any,
  res: ExpressResponse,
  next: NextFunction
) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

export const sessionIdParamValidator = param("sessionId")
  .not()
  .isEmpty()
  .trim()
  .escape();
export const durationUnitParamValidator = param("unit")
  .not()
  .isEmpty()
  .trim()
  .escape()
  .isIn(Object.values(LimitedDurationUnit));
export const sessionChannelParamValidator = param("channel")
  .not()
  .isEmpty()
  .trim()
  .escape();
export const numSegmentsQueryValidator = query("numSegments")
  .not()
  .isEmpty()
  .isNumeric()
  .escape();
export const chunkSizeInMinutesQueryValidator = query("chunkSizeInMinutes")
  .not()
  .isEmpty()
  .isNumeric()
  .escape();
export const minSpeakingAmpQueryValidator = query("minSpeakingAmp")
  .not()
  .isEmpty()
  .isFloat()
  .escape();
export const sessionNameBodyValidator = body("name")
  .not()
  .isEmpty()
  .trim()
  .escape();
export const performanceBodyValidator = body("performance")
  .not()
  .isEmpty()
  .isNumeric()
  .trim()
  .escape();
