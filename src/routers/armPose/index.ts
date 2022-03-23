import express from "express";

import {
  getArmPoseDataInSession,
  getArmPoseTotalsInSession,
} from "./controller";
import {
  ensureValidInput,
  authenticateToken,
  ensureUserOwnsSession,
  sessionIdParamValidator,
  durationUnitParamValidator,
  chunkSizeInMinutesQueryValidator,
} from "../middleware";
import { Response } from "../types";
import * as Const from "../../variables";
import { VideoChannel } from "../sessions/types";
import { getVideoFramesBySessionId } from "../engine";

const router = express.Router();
router.use(authenticateToken);

/**
 * Get Arm Pose totals in Session
 */
const getArmPoseTotalsInSessionEndpoint = `/totals/:unit/:sessionId`;
router.get(
  getArmPoseTotalsInSessionEndpoint,
  sessionIdParamValidator,
  durationUnitParamValidator,
  ensureValidInput,
  ensureUserOwnsSession,
  async (req, res) => {
    const { sessionId, unit } = req.params!;

    let response;
    try {
      const videoFrames = await getVideoFramesBySessionId(
        sessionId,
        VideoChannel.Student,
        {
          username: Const.DB_USER,
          password: Const.DB_PASS,
        }
      );
      response = getArmPoseTotalsInSession(videoFrames, unit);
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
        VideoChannel.Student,
        {
          username: Const.DB_USER,
          password: Const.DB_PASS,
        }
      );
      response = await getArmPoseDataInSession(
        videoFrames,
        parseInt(chunkSizeInMinutes)
      );
    } catch (error) {
      console.error(error);

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
