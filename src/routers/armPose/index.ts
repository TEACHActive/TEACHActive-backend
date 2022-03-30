import express from "express";

import {
  getArmPoseDataInSession,
  getArmPoseTotalsInMultipleSessions,
  getArmPoseTotalsInSession,
} from "./controller";
import {
  ensureValidInput,
  authenticateToken,
  ensureUserOwnsSession,
  sessionIdParamValidator,
  durationUnitParamValidator,
  chunkSizeInMinutesQueryValidator,
  multipleSessionIdsQueryValidator,
} from "../middleware";
import { Response } from "../types";
import * as Const from "../../variables";
import { VideoChannel } from "../sessions/types";
import {
  getSessionById,
  getVideoFramesBySessionId,
  isAdminRequest,
} from "../engine";
import { TokenSign } from "../user/types";

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
 * Get Arm Pose totals in Multiple Sessions
 */
const getArmPoseTotalsInMultipleSessionsEndpoint = `/multiple/totals/:unit`;
router.get(
  getArmPoseTotalsInMultipleSessionsEndpoint,
  durationUnitParamValidator,
  multipleSessionIdsQueryValidator,
  ensureValidInput,
  ensureUserOwnsSession,
  async (req, res) => {
    const { unit } = req.params!;
    const tokenSign: TokenSign = req.user;
    const { sessionIds } = req.query!;

    const adminRequest = await isAdminRequest(tokenSign);

    let response;
    try {
      response = await getArmPoseTotalsInMultipleSessions(
        sessionIds,
        adminRequest,
        tokenSign.uid,
        unit
      );
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
      response = getArmPoseDataInSession(
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
