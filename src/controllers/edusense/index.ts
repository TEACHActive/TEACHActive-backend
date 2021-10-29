import express from "express";
import { Response } from "../types";
import {
  getNumberOfFramesOfArmPosesInSession,
  getStudentAttendenceStatsInSession,
  getInstructorMovementInSession,
  getStudentSitVsStandInSession,
  getArmPosesInSession,
  getFramesBySessionId,
  getSessionsByUID,
  getAllSessions,
  setSessionName,
  setSessionPerformance,
  getSessionsWithMetadataByUID,
  getAllSessionsWithMetadata,
  getStudentSpeechFrameNumberInSession,
} from "./controller";
import { ParseChannel } from "./util";
import * as Constants from "../../constants";
import { Channel } from "./types";

const app = express();
const baseEndpoint = "/edusense";

/**
 * Test Endpoint
 */
app.get(`${baseEndpoint}`, async function (req, res) {
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
    //Check to see if UID matches an admin UID
    if (Constants.ADMIN_LIST.includes(uid)) {
      //User making request is an admin
      response = await getAllSessionsWithMetadata();
    } else {
      //User making request is not an admin
      response = await getSessionsWithMetadataByUID(uid);
    }
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
const getStudentAttendenceStatsInSessionEndpoint = `${baseEndpoint}/attendance/:sessionId`;
app.get(getStudentAttendenceStatsInSessionEndpoint, async function (req, res) {
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

/**
 * Get Speech Thresholded data in Session
 */
const getStudentSpeechFrameNumberInSessionEndpoint = `${baseEndpoint}/student/speech/:sessionId/:threashold`;
app.get(
  getStudentSpeechFrameNumberInSessionEndpoint,
  async function (req, res) {
    const { sessionId, threashold } = req.params;
    let response;

    const threasholdNum = parseFloat(threashold);

    try {
      response = await getStudentSpeechFrameNumberInSession(
        sessionId,
        threasholdNum
      );
    } catch (error) {
      response = new Response(
        false,
        null,
        500,
        "Server error when getting Student Speech Frame Number In Session"
      );
    }

    res.statusCode = response.statusCode;
    res.json(response);
  }
);

/**
 * Get student Speech data in Session
 */
const getStudentSpeechDataInSessionEndpoint = `${baseEndpoint}/student/speech/frames/:sessionId`;
app.get(getStudentSpeechDataInSessionEndpoint, async function (req, res) {
  const { sessionId } = req.params;
  let response;

  try {
    response = await getFramesBySessionId(sessionId, Channel.Student);
  } catch (error) {
    response = new Response(
      false,
      null,
      500,
      "Server error when getting Student Speech Data In Session"
    );
  }

  res.statusCode = response.statusCode;
  res.json(response);
});

/**
 * Get instructor Speech data in Session
 */
const getInstructorSpeechDataInSessionEndpoint = `${baseEndpoint}/instructor/speech/frames/:sessionId`;
app.get(getInstructorSpeechDataInSessionEndpoint, async function (req, res) {
  const { sessionId } = req.params;
  let response;

  try {
    response = await getFramesBySessionId(sessionId, Channel.Instructor);
  } catch (error) {
    response = new Response(
      false,
      null,
      500,
      "Server error when getting Instructor Speech Data In Session"
    );
  }

  res.statusCode = response.statusCode;
  res.json(response);
});

/**
 * Update a session name
 */
app.put(`${baseEndpoint}/sessions/name`, async (req, res) => {
  const { sessionId, name } = req.body;

  let response;

  try {
    if (sessionId === undefined) {
      return new Response(false, null, 400, "id must be defined");
    }
    response = await setSessionName(sessionId, name);
  } catch (error) {
    response = new Response(
      false,
      null,
      500,
      "Server error when updating session name"
    );
  }

  res.statusCode = response.statusCode;
  res.json(response);
});

/**
 * Update a session performance
 */
app.put(`${baseEndpoint}/sessions/performance`, async (req, res) => {
  const { sessionId, performance } = req.body;

  let response;

  try {
    if (sessionId === undefined) {
      return new Response(false, null, 400, "id must be defined");
    }
    response = await setSessionPerformance(sessionId, performance);
  } catch (error) {
    if (typeof error === "string") {
      response = new Response(
        false,
        null,
        500,
        "Server error when updating session performance",
        error
      );
    } else {
      response = new Response(
        false,
        null,
        500,
        "Server error when updating session performance",
        ""
      );
    }
  }

  res.statusCode = response.statusCode;
  res.json(response);
});

export { app as edusense };
