import express from "express";

import {
  ensureValidInput,
  authenticateToken,
  ensureUserOwnsSession,
  sessionIdParamValidator,
  numSegmentsQueryValidator,
} from "../middleware";
import { Response } from "../types";
import * as Const from "../../variables";
import { VideoChannel } from "../sessions/types";
import { getVideoFramesBySessionId } from "../engine";
import { getSitStandDataInSession } from "./controller";

const router = express.Router();
router.use(authenticateToken);

// const getSitStandTestEndpoint = `/test/:sessionId`;
// router.get(
//   getSitStandTestEndpoint,
//   sessionIdParamValidator,
//   numSegmentsQueryValidator,
//   ensureValidInput,
//   ensureUserOwnsSession,
//   async (req, res) => {
//     const { sessionId } = req.params!;
//     const numSegments = req.query!.numSegments as string;

//     let response;
//     try {
//       const videoFrames = await getVideoFramesBySessionId(
//         sessionId,
//         VideoChannel.Student,
//         {
//           username: Const.DB_USER,
//           password: Const.DB_PASS,
//         }
//       );
//       response = await getSitStandTestInSession(
//         videoFrames,
//         parseInt(numSegments)
//       );
//     } catch (error) {
//       console.error(error);

//       response = new Response(
//         false,
//         null,
//         500,
//         "Server error when getting sit stand data in session"
//       );
//     }

//     res.statusCode = response.statusCode;
//     res.json(response);
//   }
// );

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
        VideoChannel.Student,
        {
          username: Const.DB_USER,
          password: Const.DB_PASS,
        }
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
