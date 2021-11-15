import express from "express";

import { Response } from "../types";
import { authenticateToken, checkIfUserOwnsSession } from "../middleware";
import { getAttendanceInSession } from "./controller";

const router = express.Router();
router.use(authenticateToken);
router.use(checkIfUserOwnsSession);

/**
 * Get Attendance in Session
 */
const getAttendanceInSessionEndpoint = `/:sessionId`;
router.get(getAttendanceInSessionEndpoint, async (req, res) => {
  const { sessionId } = req.params;

  let response;
  try {
    response = await getAttendanceInSession(sessionId);
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
});

const baseEndpoint = "/attendance";
export { router, baseEndpoint };
