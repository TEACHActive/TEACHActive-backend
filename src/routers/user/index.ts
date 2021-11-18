import express from "express";

import { Response } from "../types";
import { getUser } from "./controller";
import { authenticateToken } from "../middleware";
import { TokenSign } from "./types";

const router = express.Router();
router.use(authenticateToken);

/**
 * Get User by UID
 */
const getUserEndpoint = ``;
router.get(getUserEndpoint, async (req, res) => {
  let response;
  try {
    const _req: any = req;
    const tokenSign: TokenSign = _req.user;
    response = await getUser(tokenSign);
  } catch (error) {
    response = new Response(
      false,
      null,
      500,
      "Server error when getting instructor movement"
    );
  }

  res.statusCode = response.statusCode;
  res.json(response);
});

const baseEndpoint = "/user";
export { router, baseEndpoint };
