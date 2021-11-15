import express from "express";

import { Response } from "../types";
import { authenticateToken } from "../middleware";
import { getReflectionSectionsForSession } from "./controller";

const router = express.Router();
router.use(authenticateToken);

/**
 * Get Reflections for session
 */
const getReflectionsForSessionEndpoint = `/:sessionId`;
router.get(getReflectionsForSessionEndpoint, async (req, res) => {
  const { sessionId } = req.params;
  let response;

  try {
    response = getReflectionSectionsForSession(sessionId);
  } catch (error) {
    response = new Response(
      false,
      null,
      500,
      "Server error when getting reflection sections"
    );
  }

  res.statusCode = response.statusCode;
  res.json(response);
});

const baseEndpoint = "/reflections";
export { router, baseEndpoint };
