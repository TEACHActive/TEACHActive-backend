import express from "express";

import { Response } from "../types";
import { authenticateToken } from "../middleware";
import { getInstructorMovementDataInSession } from "./controller";

const router = express.Router();
router.use(authenticateToken);

/**
 * Get Instructor Movement in session
 */
const getInstructorMovementDataInSessionEndpoint = `/instructor/:sessionId`;
router.get(getInstructorMovementDataInSessionEndpoint, async (req, res) => {
  const { sessionId } = req.params;
  const numSegments = req.query.numSegments as string;

  let response;
  try {
    response = getInstructorMovementDataInSession(
      sessionId,
      parseInt(numSegments)
    );
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

const baseEndpoint = "/movement";
export { router, baseEndpoint };
