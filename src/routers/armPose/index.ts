import express from "express";

import {
  getArmPoseDataInSession,
  getArmPoseTotalsInSecondsInSession,
} from "./controller";
import { Response } from "../types";
import {
  ensureValidInput,
  authenticateToken,
  ensureUserOwnsSession,
  sessionIdParamValidator,
  numSegmentsQueryValidator,
} from "../middleware";
import { VideoChannel } from "../sessions/types";
import { getVideoFramesBySessionId } from "../engine";

const router = express.Router();
router.use(authenticateToken);

/**
 * Get Arm Pose totals in session
 */
const getArmPoseTotalsInSessionEndpoint = `/totals/seconds/:sessionId`;
router.get(
  getArmPoseTotalsInSessionEndpoint,
  sessionIdParamValidator,
  ensureValidInput,
  ensureUserOwnsSession,
  async (req, res) => {
    const { sessionId } = req.params!;

    let response;
    try {
      const videoFrames = await getVideoFramesBySessionId(
        sessionId,
        VideoChannel.Student
      );
      response = await getArmPoseTotalsInSecondsInSession(videoFrames);
    } catch (error) {
      console.error(error);

      response = new Response(
        false,
        null,
        500,
        "Server error when getting arm pose totals in session"
      );
    }

    res.statusCode = response.statusCode;
    res.json(response);
  }
);

/**
 * Get Arm Pose Data in session
 */
const getArmPoseDataInSessionEndpoint = `/data/:sessionId`;
router.get(
  getArmPoseDataInSessionEndpoint,
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
      response = await getArmPoseDataInSession(
        videoFrames,
        parseInt(numSegments)
      );
    } catch (error) {
      console.log(error);

      response = new Response(
        false,
        null,
        500,
        "Server error when getting arm pose data in session"
      );
    }

    res.statusCode = response.statusCode;
    res.json(response);
  }
);

const baseEndpoint = "/armPose";
export { router, baseEndpoint };
