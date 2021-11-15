import express from "express";

import { Response } from "../types";
import { authenticateToken } from "../middleware";
import { getSessionPerformanceInSession } from "./controller";

const router = express.Router();
router.use(authenticateToken);

/**
 * Get Performance metric for session
 */
const getPerformanceForSessionEndpoint = `/:sessionId`;
router.get(getPerformanceForSessionEndpoint, async (req, res) => {
  const { sessionId } = req.params;
  let response;

  try {
    response = getSessionPerformanceInSession(sessionId);
  } catch (error) {
    response = new Response(
      false,
      null,
      500,
      "Server error when getting session performance"
    );
  }

  res.statusCode = response.statusCode;
  res.json(response);
});

const baseEndpoint = "/performance";
export { router, baseEndpoint };
