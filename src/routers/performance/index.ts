import express from "express";

import { Response } from "../types";
import {
  getSessionPerformanceForSession,
  getSessionPerformanceInMultipleSessions,
  setSessionPerformanceForSession,
} from "./controller";
import {
  ensureValidInput,
  authenticateToken,
  ensureUserOwnsSession,
  sessionIdParamValidator,
  performanceBodyValidator,
  multipleSessionIdsQueryValidator,
} from "../middleware";
import { TokenSign } from "../user/types";
import { isAdminRequest } from "../engine";

const router = express.Router();
router.use(authenticateToken);

/**
 * Get Performance metric for session
 */
const getPerformanceForSessionEndpoint = `/stats/:sessionId`;
router.get(
  getPerformanceForSessionEndpoint,
  sessionIdParamValidator,
  ensureValidInput,
  ensureUserOwnsSession,
  async (req, res) => {
    const { sessionId } = req.params!;
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
  }
);

/**
 * Get Performance metric totals in multiple Sessions
 */
const getPerformanceForMultipleSessionsEndpoint = `/multiple`;
router.get(
  getPerformanceForMultipleSessionsEndpoint,
  multipleSessionIdsQueryValidator,
  ensureValidInput,
  ensureUserOwnsSession,
  async (req, res) => {
    const tokenSign: TokenSign = req.user;
    const { sessionIds } = req.query!;

    const adminRequest = await isAdminRequest(tokenSign);

    let response;
    try {
      response = await getSessionPerformanceInMultipleSessions(
        sessionIds,
        adminRequest,
        tokenSign.uid
      );
    } catch (error) {
      console.error(error);

      response = new Response(
        false,
        null,
        500,
        "Server error when getting Performance in sessions"
      );
    }

    res.statusCode = response.statusCode;
    res.json(response);
  }
);

/**
 * Set Performance metric for session
 */
const setPerformanceForSessionEndpoint = `/:sessionId`;
router.put(
  setPerformanceForSessionEndpoint,
  sessionIdParamValidator,
  performanceBodyValidator,
  ensureValidInput,
  ensureUserOwnsSession,
  async (req, res) => {
    const { sessionId } = req.params!;
    const { performance } = req.body;

    let response;

    if (!performance) {
      response = new Response(
        false,
        null,
        400,
        "Must pass performance in body, performance not updated"
      );
    }

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
  }
);

const baseEndpoint = "/performance";
export { router, baseEndpoint };
