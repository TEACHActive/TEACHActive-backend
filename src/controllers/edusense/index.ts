import express from "express";
import { Response } from "../types";
import {
  getNumberOfFramesOfArmPosesInSession,
  getStudentAttendenceStatsInSession,
  getSessionsWithMetadataByUID,
  getInstructorMovementInSession,
  getStudentSitVsStandInSession,
  getArmPosesInSession,
  getFramesBySessionId,
} from "./controller";
import { ParseChannel } from "./util";

const app = express();
const baseEndpoint = "/edusense";

/**
 * Test Endpoint
 */
app.get(`${baseEndpoint}`, async function (req, res) {
  console.log(`${baseEndpoint}`);
  // const { mongoose } = req;

  // const sessions = await SessionModel.find().exec();
  // res.json(sessions);
  res.end("Hello Edusense");
});

/**
 * Get Sessions by UID
 */
const getSessionsByUIDEndpoint = `${baseEndpoint}/sessions/:uid`;
app.get(getSessionsByUIDEndpoint, async function (req, res) {
  const { uid } = req.params;

  let response;

  try {
    response = await getSessionsWithMetadataByUID(uid);
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
 * Get Frames by sessionId
 */
const getFramesBySessionIdEndpoint = `${baseEndpoint}/frames/:sessionId/:channel`;
app.get(getFramesBySessionIdEndpoint, async function (req, res) {
  const { sessionId, channel } = req.params;

  let response;

  try {
    const parsedChannel = ParseChannel(channel);
    if (!parsedChannel) {
      response = new Response(
        false,
        null,
        400,
        "Must select channel of type student or instructor"
      );
    } else {
      response = await getFramesBySessionId(sessionId, parsedChannel);
    }
  } catch (error) {
    response = new Response(
      false,
      null,
      500,
      "Server error when getting frames"
    );
  }

  res.statusCode = response.statusCode;
  res.json(response);
});

/**
 * Get Number Of Frames Of Arm poses In Session
 */
const getNumberOfFramesOfArmPosesInSessionEndpoint = `${baseEndpoint}/armPose/:sessionId`;
app.get(
  getNumberOfFramesOfArmPosesInSessionEndpoint,
  async function (req, res) {
    const { sessionId } = req.params;

    let response;

    try {
      response = await getNumberOfFramesOfArmPosesInSession(sessionId);
    } catch (error) {
      response = new Response(
        false,
        null,
        500,
        "Server error when getting arm poses"
      );
    }

    res.statusCode = response.statusCode;
    res.json(response);
  }
);

/**
 * Get Arm poses In Session
 */
const getArmPosesInSessionEndpoint = `${baseEndpoint}/armPose/frames/:sessionId`;
app.get(getArmPosesInSessionEndpoint, async function (req, res) {
  const { sessionId } = req.params;

  let response;

  try {
    response = await getArmPosesInSession(sessionId);
  } catch (error) {
    response = new Response(
      false,
      null,
      500,
      "Server error when getting arm pose frames"
    );
  }

  res.statusCode = response.statusCode;
  res.json(response);
});

/**
 * Get Student Attendance In Session
 */
const getStudentAttendenceInSessionEndpoint = `${baseEndpoint}/attendance/:sessionId`;
app.get(getStudentAttendenceInSessionEndpoint, async function (req, res) {
  const { sessionId } = req.params;

  let response;

  try {
    response = await getStudentAttendenceStatsInSession(sessionId);
  } catch (error) {
    response = new Response(
      false,
      null,
      500,
      "Server error when getting attendence"
    );
  }

  res.statusCode = response.statusCode;
  res.json(response);
});

/**
 * Get Instructor Movement in Session
 */
const getInstructorMovementEndpoint = `${baseEndpoint}/instructor/movement/:sessionId`;
app.get(getInstructorMovementEndpoint, async function (req, res) {
  const { sessionId } = req.params;
  let response;

  try {
    response = await getInstructorMovementInSession(sessionId);
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
 * Get Sit vs Stand in Session
 */
const getStudentSitVsStandInSessionEndpoint = `${baseEndpoint}/student/sitvsstand/:sessionId`;
app.get(getStudentSitVsStandInSessionEndpoint, async function (req, res) {
  const { sessionId } = req.params;
  let response;

  try {
    response = await getStudentSitVsStandInSession(sessionId);
  } catch (error) {
    response = new Response(
      false,
      null,
      500,
      "Server error when getting Sit vs Stand"
    );
  }

  res.statusCode = response.statusCode;
  res.json(response);
});

export { app as edusense };
