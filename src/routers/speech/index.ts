import express from "express";

import { authenticateToken } from "../middleware";
import { Response } from "../types";
import {
  getSpeechTotalsInSession,
  getStudentSpeechDataSession,
  getInstructorSpeechDataSession,
} from "./controller";

const router = express.Router();
router.use(authenticateToken);

/**
 * Get Student Speech Data in Session
 */
const getStudentSpeechDataSessionEndpoint = `/student/data/:sessionId`;
router.get(getStudentSpeechDataSessionEndpoint, async (req, res) => {
  const { sessionId } = req.params;
  const numSegments = req.query.numSegments as string;

  let response;
  try {
    response = await getStudentSpeechDataSession(
      sessionId,
      parseInt(numSegments)
    );
  } catch (error) {
    response = new Response(
      false,
      null,
      500,
      "Server error when getting instructor movement"
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
    response = await getInstructorSpeechDataSession(
      sessionId,
      parseInt(numSegments)
    );
  } catch (error) {
    response = new Response(
      false,
      null,
      500,
      "Server error when getting instructor movement"
    );
  }

  res.statusCode = response.statusCode;
  res.json(response);
});

/**
 * Get Speech Totals In session
 */
const getSpeechTotalsInSessionEndpoint = `/totals/:sessionId`;
router.get(getSpeechTotalsInSessionEndpoint, async (req, res) => {
  const { sessionId } = req.params;

  let response;
  try {
    response = await getSpeechTotalsInSession(sessionId);
  } catch (error) {
    response = new Response(
      false,
      null,
      500,
      "Server error when getting instructor movement"
    );
  }

  res.statusCode = response.statusCode;
  res.json(response);
});

const baseEndpoint = "/speech";
export { router, baseEndpoint };
