import express from "express";
import { getVideoFramesBySessionId } from "../engine";

import {
  ensureValidInput,
  authenticateToken,
  ensureUserOwnsSession,
  sessionIdParamValidator,
  numSegmentsQueryValidator,
} from "../middleware";
import { Response } from "../types";
import { VideoChannel } from "../sessions/types";
import { getSitStandDataInSession } from "./controller";

const router = express.Router();
router.use(authenticateToken);

/**
 * Get sit stand data in session
 */
const getSitStandDataInSessionEndpoint = `/data/:sessionId`;
router.get(
  getSitStandDataInSessionEndpoint,
  sessionIdParamValidator,
  numSegmentsQueryValidator,
  ensureValidInput,
  ensureUserOwnsSession,
  async (req, res) => {
    const { sessionId } = req.params!;
    const numSegments = req.query!.numSegments as string;

    let response;
    try {
      const videoFrames = await getVideoFramesBySessionId(
        sessionId,
        VideoChannel.Student
      );
      response = await getSitStandDataInSession(
        videoFrames,
        parseInt(numSegments)
      );
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
  }
);

const baseEndpoint = "/sitStand";
export { router, baseEndpoint };
