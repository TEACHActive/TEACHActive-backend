import express from "express";

import { Response } from "../types";
import { getInstructorMovementDataInSession } from "./controller";
import {
  ensureValidInput,
  authenticateToken,
  ensureUserOwnsSession,
  sessionIdParamValidator,
  numSegmentsQueryValidator,
} from "../middleware";

const router = express.Router();
router.use(authenticateToken);

/**
 * Get Instructor Movement in session
 */
const getInstructorMovementDataInSessionEndpoint = `/instructor/:sessionId`;
router.get(
  getInstructorMovementDataInSessionEndpoint,
  sessionIdParamValidator,
  numSegmentsQueryValidator,
  ensureValidInput,
  ensureUserOwnsSession,
  async (req, res) => {
    const { sessionId } = req.params!;
    const numSegments = req.query!.numSegments as string;

    let response;
    try {
      response = await getInstructorMovementDataInSession(
        sessionId,
        parseInt(numSegments)
      );
    } catch (error) {
      console.error(error);

      response = new Response(
        false,
        null,
        500,
        "Server error when getting instructor movement"
      );
    }

    res.statusCode = response.statusCode;
    res.json(response);
  }
);

const baseEndpoint = "/movement";
export { router, baseEndpoint };
