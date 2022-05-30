import express from "express";

import { Response } from "../types";
import * as Const from "../../variables";
import {
  getSpeechDataInSession,
  getSpeechDataCombinedInSession,
  getSpeechTotalsInSecondsInSession,
} from "./controller";
import {
  ensureValidInput,
  authenticateToken,
  ensureUserOwnsSession,
  sessionIdParamValidator,
  numSegmentsQueryValidator,
  minSpeakingAmpQueryValidator,
  chunkSizeInMinutesQueryValidator,
} from "../middleware";
import { AudioChannel } from "../sessions/types";
import { getAudioFramesBySessionId } from "../engine";

const router = express.Router();

router.use(authenticateToken);

/**
 * Get Student Speech Data in Session
 */
const getStudentSpeechDataSessionEndpoint = `/student/data/:sessionId`;
router.get(
  getStudentSpeechDataSessionEndpoint,
  sessionIdParamValidator,
  numSegmentsQueryValidator,
  ensureValidInput,
  ensureUserOwnsSession,
  async (req, res) => {
    const { sessionId } = req.params!;
    const numSegments = req.query!.numSegments as string;

    let response;
    try {
      const audioFrames = await getAudioFramesBySessionId(
        sessionId,
        AudioChannel.Student,
        {
          username: Const.DB_USER,
          password: Const.DB_PASS,
        }
      );
      response = await getSpeechDataInSession(
        audioFrames,
        AudioChannel.Student,
        parseInt(numSegments)
      );
    } catch (error) {
      response = new Response(
        false,
        null,
        500,
        "Server error when getting Student Speech Data in Session"
      );
    }

    res.statusCode = response.statusCode;
    res.json(response);
  }
);

/**
 * Get Instructor Speech Data in Session
 */
const getInstructorSpeechDataSessionEndpoint = `/instructor/data/:sessionId`;
router.get(
  getInstructorSpeechDataSessionEndpoint,
  sessionIdParamValidator,
  numSegmentsQueryValidator,
  ensureValidInput,
  ensureUserOwnsSession,
  async (req, res) => {
    const { sessionId } = req.params!;
    const numSegments = req.query!.numSegments as string;

    let response;
    try {
      const audioFrames = await getAudioFramesBySessionId(
        sessionId,
        AudioChannel.Instructor,
        {
          username: Const.DB_USER,
          password: Const.DB_PASS,
        }
      );
      response = getSpeechDataInSession(
        audioFrames,
        AudioChannel.Instructor,
        parseInt(numSegments)
      );
    } catch (error) {
      response = new Response(
        false,
        null,
        500,
        "Server error when getting Instructor Speech Data in Session"
      );
    }

    res.statusCode = response.statusCode;
    res.json(response);
  }
);

/**
 * Get Speech Data Combined In session
 */
const getSpeechDataCombinedInSessionEndpoint = `/data/:sessionId`;
router.get(
  getSpeechDataCombinedInSessionEndpoint,
  sessionIdParamValidator,
  chunkSizeInMinutesQueryValidator,
  minSpeakingAmpQueryValidator,
  ensureValidInput,
  ensureUserOwnsSession,
  async (req, res) => {
    const { sessionId } = req.params!;

    const minSpeakingAmp = req.query!.minSpeakingAmp as string;
    const chunkSizeInMinutes = req.query!.chunkSizeInMinutes as string;

    let response;
    try {
      const studentAudioFrames = await getAudioFramesBySessionId(
        sessionId,
        AudioChannel.Instructor,
        {
          username: Const.DB_USER,
          password: Const.DB_PASS,
        }
      );
      const instructorAudioFrames = await getAudioFramesBySessionId(
        sessionId,
        AudioChannel.Student,
        {
          username: Const.DB_USER,
          password: Const.DB_PASS,
        }
      );

      response = getSpeechDataCombinedInSession(
        studentAudioFrames,
        instructorAudioFrames,
        parseInt(chunkSizeInMinutes),
        parseFloat(minSpeakingAmp)
      );
    } catch (error) {
      response = new Response(
        false,
        null,
        500,
        "Server error when getting Speech Data Combined In session"
      );
    }

    res.statusCode = response.statusCode;
    res.json(response);
  }
);

/**
 * Get Speech Totals In session
 */
const getSpeechTotalsInSessionEndpoint = `/totals/:sessionId`;
router.get(
  getSpeechTotalsInSessionEndpoint,
  sessionIdParamValidator,
  minSpeakingAmpQueryValidator,
  ensureValidInput,
  ensureUserOwnsSession,
  async (req, res) => {
    const { sessionId } = req.params!;
    const minSpeakingAmp = req.query!.minSpeakingAmp as string;
    let response;
    try {
      const studentAudioFrames = await getAudioFramesBySessionId(
        sessionId,
        AudioChannel.Instructor,
        {
          username: Const.DB_USER,
          password: Const.DB_PASS,
        }
      );
      const instructorAudioFrames = await getAudioFramesBySessionId(
        sessionId,
        AudioChannel.Student,
        {
          username: Const.DB_USER,
          password: Const.DB_PASS,
        }
      );
      response = getSpeechTotalsInSecondsInSession(
        studentAudioFrames,
        instructorAudioFrames,
        parseFloat(minSpeakingAmp)
      );
    } catch (error) {
      console.error(error);

      response = new Response(
        false,
        null,
        500,
        "Server error when getting Speech Totals In session"
      );
    }

    res.statusCode = response.statusCode;
    res.json(response);
  }
);

const baseEndpoint = "/speech";
export { router, baseEndpoint };
