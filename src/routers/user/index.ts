import express from "express";

import { Response } from "../types";
import { getUser } from "./controller";
import { authenticateToken } from "../middleware";

const router = express.Router();
router.use(authenticateToken);

/**
 * Get User by UID
 */
const getUserEndpoint = ``;
router.get(getUserEndpoint, async (req, res) => {
  let response;
  try {
    response = await getUser(req.user);
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
