import express from "express";

import {
  getArmPoseDataInSession,
  getArmPoseTotalsInSecondsInSession,
} from "./controller";
import { Response } from "../types";
import { authenticateToken } from "../middleware";

const router = express.Router();
router.use(authenticateToken);

/**
 * Get Arm Pose totals in session
 */
const getArmPoseTotalsInSessionEndpoint = `/totals/seconds/:sessionId`;
router.get(getArmPoseTotalsInSessionEndpoint, async (req, res) => {
  const { sessionId } = req.params;

  let response;
  try {
    response = await getArmPoseTotalsInSecondsInSession(sessionId);
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
});

/**
 * Get Arm Pose Data in session
 */
const getArmPoseDataInSessionEndpoint = `/data/:sessionId`;
router.get(getArmPoseDataInSessionEndpoint, async (req, res) => {
  const { sessionId } = req.params;
  const numSegments = req.query.numSegments as string;

  let response;
  try {
    response = await getArmPoseDataInSession(sessionId, parseInt(numSegments));
  } catch (error) {
    response = new Response(
      false,
      null,
      500,
      "Server error when getting arm pose data in session"
    );
  }

  res.statusCode = response.statusCode;
  res.json(response);
});

const baseEndpoint = "/armPose";
export { router, baseEndpoint };
