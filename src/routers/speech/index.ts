import express from "express";

import { Response } from "../types";
import {
  getSpeechDataSession,
  getSpeechDataCombinedInSession,
  getSpeechTotalsInSecondsInSession,
} from "./controller";
import { authenticateToken, checkIfUserOwnsSession } from "../middleware";
import { Channel } from "../sessions/types";

const router = express.Router();
router.use(authenticateToken);
router.use(checkIfUserOwnsSession);

/**
 * Get Student Speech Data in Session
 */
const getStudentSpeechDataSessionEndpoint = `/student/data/:sessionId`;
router.get(getStudentSpeechDataSessionEndpoint, async (req, res) => {
  const { sessionId } = req.params;
  const numSegments = req.query.numSegments as string;

  let response;
  try {
    if (numSegments) {
      response = await getSpeechDataSession(
        sessionId,
        Channel.Student,
        parseInt(numSegments)
      );
    } else {
      response = await getSpeechDataSession(sessionId, Channel.Student);
    }
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
});

/**
 * Get Instructor Speech Data in Session
 */
const getInstructorSpeechDataSessionEndpoint = `/instructor/data/:sessionId`;
router.get(getInstructorSpeechDataSessionEndpoint, async (req, res) => {
  const { sessionId } = req.params;
  const numSegments = req.query.numSegments as string;

  let response;
  try {
    if (numSegments) {
      response = await getSpeechDataSession(
        sessionId,
        Channel.Instructor,
        parseInt(numSegments)
      );
    } else {
      response = await getSpeechDataSession(sessionId, Channel.Instructor);
    }
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
});

/**
 * Get Speech Data Combined In session
 */
const getSpeechDataCombinedInSessionEndpoint = `/data/:sessionId`;
router.get(getSpeechDataCombinedInSessionEndpoint, async (req, res) => {
  const { sessionId } = req.params;
  const minSpeakingAmp = req.query.minSpeakingAmp as string;
  const numSegments = req.query.numSegments as string;

  let response;
  try {
    if (minSpeakingAmp && numSegments) {
      response = await getSpeechDataCombinedInSession(
        sessionId,
        parseInt(numSegments),
        parseFloat(minSpeakingAmp)
      );
    } else {
      response = await getSpeechDataCombinedInSession(sessionId);
    }
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
});

/**
 * Get Speech Totals In session
 */
const getSpeechTotalsInSessionEndpoint = `/totals/seconds/:sessionId`;
router.get(getSpeechTotalsInSessionEndpoint, async (req, res) => {
  const { sessionId } = req.params;
  const minSpeakingAmp = req.query.minSpeakingAmp as string;

  let response;
  try {
    if (minSpeakingAmp) {
      response = await getSpeechTotalsInSecondsInSession(
        sessionId,
        parseFloat(minSpeakingAmp)
      );
    } else {
      response = await getSpeechTotalsInSecondsInSession(sessionId);
    }
  } catch (error) {
    response = new Response(
      false,
      null,
      500,
      "Server error when getting Speech Totals In session"
    );
  }

  res.statusCode = response.statusCode;
  res.json(response);
});

const baseEndpoint = "/speech";
export { router, baseEndpoint };
