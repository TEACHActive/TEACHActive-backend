import jwt from "jsonwebtoken";
import { User } from "@firebase/auth";
import { getAuth } from "firebase-admin/auth";

import { TokenResponse } from "./types";
import { TOKEN_SECRET } from "../../variables";
import { TokenSign } from "../user/types";
import { adminApp } from "../../firebase";

export const generateAccessToken = async (
  userCredential: User,
  expiresInSeconds: number = 1800
): Promise<TokenResponse | null> => {
  const tokenSign: TokenSign = { uid: userCredential.uid };

  const token = jwt.sign(tokenSign, TOKEN_SECRET as string, {
    expiresIn: `${expiresInSeconds}s`,
  });
  // const firebaseToken = await userCredential.getIdToken();
  const firebaseToken = await getAuth(adminApp).createCustomToken(
    userCredential.uid
  );
  adminApp;
  return {
    token: token,
    firebaseToken: firebaseToken,
    expiresInSeconds: expiresInSeconds,
  };
};
