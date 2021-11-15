import express from "express";

import { Response } from "../types";
import {
  getSessionPerformanceForSession,
  setSessionPerformanceForSession,
} from "./controller";
import { authenticateToken, checkIfUserOwnsSession } from "../middleware";

const router = express.Router();
router.use(authenticateToken);
router.use(checkIfUserOwnsSession);

/**
 * Get Performance metric for session
 */
const getPerformanceForSessionEndpoint = `/:sessionId`;
router.get(getPerformanceForSessionEndpoint, async (req, res) => {
  const { sessionId } = req.params;
  let response;

  try {
    response = await getSessionPerformanceForSession(sessionId);
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

/**
 * Set Performance metric for session
 */
const setPerformanceForSessionEndpoint = `/:sessionId/:performance`;
router.put(setPerformanceForSessionEndpoint, async (req, res) => {
  const { sessionId, performance } = req.params;
  let response;

  try {
    response = await setSessionPerformanceForSession(sessionId, performance);
  } catch (error) {
    response = new Response(
      false,
      null,
      500,
      "Server error when seting session performance"
    );
  }

  res.statusCode = response.statusCode;
  res.json(response);
});

const baseEndpoint = "/performance";
export { router, baseEndpoint };
