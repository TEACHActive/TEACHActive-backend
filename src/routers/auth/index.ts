import express from "express";

import { Response } from "../types";
import { TokenResponse } from "./types";
import { adminAuth } from "../../firebase";
import { TOKEN_SECRET } from "../../variables";
import { generateAccessToken } from "./controller";
import { loginWithEmailAndPassword } from "../../firebase/authController";

const router = express.Router();

/**
 * Sign In user to firebase and get auth token back
 */
const signInUserEndpoint = `/login`;
router.post(signInUserEndpoint, async (req, res) => {
  if (!req.headers.authorization) {
    const error = "Must pass user/pass as basic auth";
    console.error(error);
    const statusCode = 401;
    res.statusCode = statusCode;
    res.json(new Response(false, null, statusCode, error));
    return;
  }

  let response;
  try {
    const base64Credentials = req.headers.authorization.split(" ")[1];
    const credentials = Buffer.from(base64Credentials, "base64").toString(
      "utf8"
    );
    const [email, password] = credentials.split(":");

    //Get UID from firebase after logging in
    const userCredential = await loginWithEmailAndPassword(email, password);

    if (!userCredential) {
      const error = "Failed to log into firebase";
      console.error(error);
      const statusCode = 500;
      res.statusCode = statusCode;
      res.json(new Response(false, null, statusCode, error));
      return;
    }

    const firebaseToken = await adminAuth.createCustomToken(userCredential.uid);

    const tokenResponse = await generateAccessToken(
      userCredential.uid,
      firebaseToken,
      TOKEN_SECRET as string
    );

    if (!tokenResponse) {
      const error = "Failed to generate token";
      console.error(error);
      const statusCode = 500;
      res.statusCode = statusCode;
      res.json(new Response(false, null, statusCode, error));
      return;
    }

    response = new Response<TokenResponse>(true, tokenResponse);
  } catch (error) {
    console.error(error);
    response = new Response(
      false,
      null,
      500,
      "Server error when signing in user",
      error
    );
  }

  res.statusCode = response.statusCode;
  res.json(response);
});

const baseEndpoint = "/auth";
export { router, baseEndpoint };
