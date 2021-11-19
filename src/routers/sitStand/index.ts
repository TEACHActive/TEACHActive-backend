import express from "express";

import { authenticateToken, checkIfUserOwnsSession } from "../middleware";
import { Response } from "../types";
import { getSitStandDataInSession } from "./controller";

const router = express.Router();
router.use(authenticateToken);
router.use(checkIfUserOwnsSession);

/**
 * Get sit stand data in session
 */
const getSitStandDataInSessionEndpoint = `/data/:sessionId`;
router.get(getSitStandDataInSessionEndpoint, async (req, res) => {
  const { sessionId } = req.params;
  const numSegments = req.query.numSegments as string;

  let response;
  try {
    response = await getSitStandDataInSession(sessionId, parseInt(numSegments));
  } catch (error) {
    console.error(error);

    response = new Response(
      false,
      null,
      500,
      "Server error when getting sit stand data in session"
    );
  }

  res.statusCode = response.statusCode;
  res.json(response);
});

const baseEndpoint = "/sitStand";
export { router, baseEndpoint };
