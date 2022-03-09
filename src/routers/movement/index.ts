import express from "express";

import { Response } from "../types";
import * as Const from "../../variables";
import { VideoChannel } from "../sessions/types";
import { getVideoFramesBySessionId } from "../engine";
import {
  getInstructorFoundPercentageInSession,
  getInstructorMovementDataInSession,
} from "./controller";
import {
  ensureValidInput,
  authenticateToken,
  ensureUserOwnsSession,
  sessionIdParamValidator,
  chunkSizeInMinutesQueryValidator,
} from "../middleware";

const router = express.Router();
router.use(authenticateToken);

/**
 * Get Instructor Movement in session
 */
const getInstructorFoundPercentageInSessionEndpoint = `/instructor/found-percentage/:sessionId`;
router.get(
  getInstructorFoundPercentageInSessionEndpoint,
  sessionIdParamValidator,
  ensureValidInput,
  ensureUserOwnsSession,
  async (req, res) => {
    const { sessionId } = req.params!;

    let response;
    try {
      const videoFrames = await getVideoFramesBySessionId(
        sessionId,
        VideoChannel.Instructor,
        {
          username: Const.DB_USER,
          password: Const.DB_PASS,
        }
      );
      response = getInstructorFoundPercentageInSession(videoFrames);
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

/**
 * Get Instructor Movement in session
 */
const getInstructorMovementDataInSessionEndpoint = `/instructor/:sessionId`;
router.get(
  getInstructorMovementDataInSessionEndpoint,
  sessionIdParamValidator,
  chunkSizeInMinutesQueryValidator,
  ensureValidInput,
  ensureUserOwnsSession,
  async (req, res) => {
    const { sessionId } = req.params!;
    const chunkSizeInMinutes = req.query!.chunkSizeInMinutes as string;

    let response;
    try {
      const videoFrames = await getVideoFramesBySessionId(
        sessionId,
        VideoChannel.Instructor,
        {
          username: Const.DB_USER,
          password: Const.DB_PASS,
        }
      );
      response = getInstructorMovementDataInSession(
        videoFrames,
        parseInt(chunkSizeInMinutes)
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
