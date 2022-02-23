import express from "express";

import {
  ensureValidInput,
  authenticateToken,
  ensureUserOwnsSession,
  sessionIdParamValidator,
} from "../middleware";
import { Response } from "../types";
import * as Const from "../../variables";
import { VideoChannel } from "../sessions/types";
import { getAttendanceFromVideoFrames } from "./controller";
import { getVideoFramesBySessionId } from "../engine";

const router = express.Router();
router.use(authenticateToken);

/**
 * Get Attendance in Session
 */
const getAttendanceInSessionEndpoint = `/:sessionId`;
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
      response = await getAttendanceFromVideoFrames(videoFrames);
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

const baseEndpoint = "/attendance";
export { router, baseEndpoint };
