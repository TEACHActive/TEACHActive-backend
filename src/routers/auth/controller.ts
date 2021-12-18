import jwt from "jsonwebtoken";

import { TokenResponse } from "./types";
import { TokenSign } from "../user/types";

const DefaultExpireTimeSeconds = 1800;

export const generateAccessToken = async (
  uid: string,
  firebaseToken: string,
  tokenSecret: string,
  expiresInSeconds: number = DefaultExpireTimeSeconds
): Promise<TokenResponse | null> => {
  expiresInSeconds =
    expiresInSeconds > 0 ? expiresInSeconds : DefaultExpireTimeSeconds;

  const token = generateJWTToken(uid, tokenSecret, expiresInSeconds);

  return {
    token: token,
    firebaseToken: firebaseToken,
    expiresInSeconds: expiresInSeconds,
  };
};

export const generateJWTToken = (
  uid: string,
  tokenSecret: string,
  expiresInSeconds: number
): string => {
  const tokenSign: TokenSign = { uid: uid };

  const token = jwt.sign(tokenSign, tokenSecret, {
    expiresIn: `${expiresInSeconds}s`,
  });

  return token;
};
