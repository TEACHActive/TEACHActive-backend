import express from "express";

import {
  ensureValidInput,
  authenticateToken,
  ensureUserOwnsSession,
  sessionIdParamValidator,
  multipleSessionIdsQueryValidator,
} from "../middleware";
import { Response } from "../types";
import * as Const from "../../variables";
import { VideoChannel } from "../sessions/types";
import {
  getAttendanceFromVideoFrames,
  getAttendanceFromVideoFramesInMultipleSessions,
} from "./controller";
import { TokenSign } from "../user/types";
import { getVideoFramesBySessionId, isAdminRequest } from "../engine";

const router = express.Router();
router.use(authenticateToken);

/**
 * Get Attendance in Session
 */
const getAttendanceInSessionEndpoint = `/stats/:sessionId`;
router.get(
  getAttendanceInSessionEndpoint,
  sessionIdParamValidator,
  ensureValidInput,
  ensureUserOwnsSession,
  async (req, res) => {
    const { sessionId } = req.params!;

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
      response = getAttendanceFromVideoFrames(videoFrames);
    } catch (error) {
      console.error(error);

      response = new Response(
        false,
        null,
        500,
        "Server error when getting attendance"
      );
    }

    res.statusCode = response.statusCode;
    res.json(response);
  }
);

/**
 * Get attendance totals in Multiple Sessions
 */
const getAttendanceTotalsInMultipleSessionsEndpoint = `/multiple`;
router.get(
  getAttendanceTotalsInMultipleSessionsEndpoint,
  multipleSessionIdsQueryValidator,
  ensureValidInput,
  ensureUserOwnsSession,
  async (req, res) => {
    console.log(123);

    const tokenSign: TokenSign = req.user;
    const { sessionIds } = req.query!;

    const adminRequest = await isAdminRequest(tokenSign);

    let response;
    try {
      response = await getAttendanceFromVideoFramesInMultipleSessions(
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
        "Server error when getting attendance totals in session"
      );
    }

    res.statusCode = response.statusCode;
    res.json(response);
  }
);

const baseEndpoint = "/attendance";
export { router, baseEndpoint };
