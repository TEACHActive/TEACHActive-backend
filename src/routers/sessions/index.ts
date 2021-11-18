import express from "express";

import { Response } from "../types";
import { ParseChannel } from "../engine";
import { TokenSign } from "../user/types";
import * as Constants from "../../variables";
import {
  getSessions,
  getVideoFramesInSession,
  getAudioFramesInSession,
  updateSessionNameBySessionId,
} from "./controller";
import {
  authenticateToken,
  checkIfUserOwnsSession,
  checkIsUserAdmin,
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

    const isAdminRequest = Constants.ADMIN_LIST.includes(tokenSign.uid);
    response = await getSessions(tokenSign.uid, isAdminRequest);
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
  checkIfUserOwnsSession,
  async (req, res) => {
    const { sessionId } = req.params;
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
  checkIfUserOwnsSession,
  checkIsUserAdmin,
  async (req, res) => {
    const { sessionId, channel } = req.params;

    let response;
    try {
      const _req: any = req;
      const tokenSign: TokenSign = _req.user;
      const parsedChannel = ParseChannel(channel);
      response = await getVideoFramesInSession(
        sessionId,
        parsedChannel,
        tokenSign
      );
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
  checkIfUserOwnsSession,
  checkIsUserAdmin,
  async (req, res) => {
    const { sessionId, channel } = req.params;

    let response;
    try {
      const _req: any = req;
      const tokenSign: TokenSign = _req.user;
      const parsedChannel = ParseChannel(channel);
      response = await getAudioFramesInSession(
        sessionId,
        parsedChannel,
        tokenSign
      );
    } catch (error) {
      response = new Response(
        false,
        null,
        500,
        "Server error when getting audio frames"
      );
    }

    res.statusCode = response.statusCode;
    res.json(response);
  }
);

const baseEndpoint = "/sessions";
export { router, baseEndpoint };