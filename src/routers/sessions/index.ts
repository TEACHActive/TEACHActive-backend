import express from "express";

import { Response } from "../types";
import * as Const from "../../variables";
import { TokenSign } from "../user/types";
import { getSessions, updateSessionNameBySessionId } from "./controller";
import {
  isAdminRequest,
  ParseVideoChannel,
  ParseAudioChannel,
  getVideoFramesBySessionId,
  getAudioFramesBySessionId,
} from "../engine";
import {
  ensureValidInput,
  authenticateToken,
  ensureUserIsAdmin,
  ensureUserOwnsSession,
  sessionIdParamValidator,
  sessionNameBodyValidator,
  sessionChannelParamValidator,
} from "../middleware";

const router = express.Router();
router.use(authenticateToken);

/**
 * Get Sessions by UID
 */
const getSessionsEndpoint = ``;
router.get(getSessionsEndpoint, async (req, res) => {
  let response;
  try {
    const _req: any = req;
    const tokenSign: TokenSign = _req.user;

    const adminRequest = await isAdminRequest(tokenSign);
    response = await getSessions(tokenSign.uid, adminRequest);
  } catch (error) {
    response = new Response(
      false,
      null,
      500,
      "Server error when getting sessions"
    );
  }

  res.statusCode = response.statusCode;
  res.json(response);
});

/**
 * Update session name by session id
 */
const updateSessionNameBySessionIdEndpoint = `/:sessionId`;
router.put(
  updateSessionNameBySessionIdEndpoint,
  sessionIdParamValidator,
  sessionNameBodyValidator,
  ensureValidInput,
  ensureUserOwnsSession,
  async (req, res) => {
    const { sessionId } = req.params!;
    const { name } = req.body;

    let response;
    if (!name) {
      response = new Response(
        false,
        null,
        400,
        "Must pass new name in body, name not updated"
      );
    }

    try {
      response = await updateSessionNameBySessionId(sessionId, name);
    } catch (error) {
      console.error(error);

      response = new Response(
        false,
        null,
        500,
        "Server error when updating session name"
      );
    }

    res.statusCode = response.statusCode;
    res.json(response);
  }
);

/**
 * Get VideoFrames in session
 */
const getVideoFramesInSessionEndpoint = `/videoFrames/:sessionId/:channel`;
router.get(
  getVideoFramesInSessionEndpoint,
  sessionIdParamValidator,
  sessionChannelParamValidator,
  ensureValidInput,
  ensureUserIsAdmin,
  async (req, res) => {
    const { sessionId, channel } = req.params!;

    let response;
    try {
      const parsedChannel = ParseVideoChannel(channel);
      const videoFrames = await getVideoFramesBySessionId(
        sessionId,
        parsedChannel,
        {
          username: Const.DB_USER,
          password: Const.DB_PASS,
        }
      );
      response = new Response(true, videoFrames);
    } catch (error) {
      response = new Response(
        false,
        null,
        500,
        "Server error when getting videoframes"
      );
    }

    res.statusCode = response.statusCode;
    res.json(response);
  }
);

/**
 * Get AudioFrames in session
 */
const getAudioFramesInSessionEndpoint = `/audioFrames/:sessionId/:channel`;
router.get(
  getAudioFramesInSessionEndpoint,
  sessionIdParamValidator,
  sessionChannelParamValidator,
  ensureValidInput,
  ensureUserIsAdmin,
  async (req, res) => {
    const { sessionId, channel } = req.params!;

    let response;
    try {
      const parsedChannel = ParseAudioChannel(channel);

      const audioFrames = await getAudioFramesBySessionId(
        sessionId,
        parsedChannel,
        {
          username: Const.DB_USER,
          password: Const.DB_PASS,
        }
      );

      response = new Response(true, audioFrames);
    } catch (error) {
      response = new Response(
        false,
        null,
        500,
        "Server error when getting audio frames",
        error
      );
    }

    res.statusCode = response.statusCode;
    res.json(response);
  }
);

const baseEndpoint = "/sessions";
export { router, baseEndpoint };
