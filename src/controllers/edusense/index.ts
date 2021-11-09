import express from "express";
import { Response } from "../types";
import {
  getNumberOfFramesOfArmPosesInSession,
  getStudentAttendenceStatsInSession,
  getInstructorMovementInSession,
  getStudentSitVsStandInSession,
  getArmPosesInSession,
  getSessionsByUID,
  getAllSessions,
  setSessionName,
  setSessionPerformance,
  getSessionsWithMetadataByUID,
  getAllSessionsWithMetadata,
  getSpeechFrameNumberInSession,
  getVideoFramesBySessionId,
  getAudioFramesBySessionId,
  GetSpeakerDataInSession,
} from "./controller";
import { ParseChannel } from "./util";
import * as Constants from "../../constants";
import { AudioFrame, Channel, Speaker } from "./types";

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
      response = await getVideoFramesBySessionId(sessionId, parsedChannel);
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

// /**
//  * Get Speech Thresholded data in Session
//  */
// const getStudentSpeechFrameNumberInSessionEndpoint = `${baseEndpoint}/student/speech/:sessionId/:threashold`;
// app.get(
//   getStudentSpeechFrameNumberInSessionEndpoint,
//   async function (req, res) {
//     const { sessionId, threashold } = req.params;
//     let response;

//     const threasholdNum = parseFloat(threashold);

//     try {
//       response = await getSpeechFrameNumberInSession(
//         sessionId,
//         Channel.Student,
//         threasholdNum
//       );
//     } catch (error) {
//       response = new Response(
//         false,
//         null,
//         500,
//         "Server error when getting Student Speech Frame Number In Session"
//       );
//     }

//     res.statusCode = response.statusCode;
//     res.json(response);
//   }
// );

/**
 * Get student Speech data in Session
 */
const getStudentSpeechDataInSessionEndpoint = `${baseEndpoint}/student/speech/frames/:sessionId`;
app.get(getStudentSpeechDataInSessionEndpoint, async function (req, res) {
  const { sessionId } = req.params;
  let response;

  try {
    response = await getAudioFramesBySessionId(sessionId, Channel.Student);

    if (response.data && response.data.length > 0) {
      const initialDateTime = response.data[0].timestamp;
      response.data = response.data.map((frame: AudioFrame) => {
        let timeDiff = frame.timestamp
          .diff(initialDateTime, "minutes")
          .toObject();
        // console.log(
        //   frame.timestamp.toISOTime(),
        //   initialDateTime.toISOTime(),
        //   frame.timestamp.diff(initialDateTime, "minutes").toObject().minutes
        // );

        timeDiff["minutes"] = Math.round(timeDiff["minutes"] || 0);
        return { ...frame, timeDiff: timeDiff, timestamp: frame.timestamp };
      });
    }
  } catch (error) {
    response = new Response(
      false,
      null,
      500,
      "Server error when getting Student Speech Data In Session"
    );
  }

  response.data?.sort((a: any, b: any) => a.timestamp - b.timestamp);

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
    response = await getAudioFramesBySessionId(sessionId, Channel.Instructor);

    if (response.data && response.data.length > 0) {
      const initialDateTime = response.data[0].timestamp;
      response.data = response.data
        .map((frame: AudioFrame) => {
          let timeDiff = frame.timestamp
            .diff(initialDateTime, "minutes")
            .toObject();
          timeDiff["minutes"] = Math.round(timeDiff["minutes"] || 0);
          return { ...frame, timeDiff: timeDiff };
        })
        .sort((a, b) => a.frameNumber - b.frameNumber);
    }
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
 * Get speaker data in session
 */
const getSpeakerDataInSessionEndpoint = `${baseEndpoint}/speech/speaker/:sessionId`;
app.get(getSpeakerDataInSessionEndpoint, async function (req, res) {
  const { sessionId } = req.params;

  let response;

  try {
    response = await GetSpeakerDataInSession(sessionId);
  } catch (error) {
    response = new Response(
      false,
      null,
      500,
      "Server error when getting Instructor Speech Data In Session"
    );
  }

  res.statusCode = 500;
  res.json(response);
});

/**
 * Get Total speech times in session
 */
const getTotalSpeechTimesInSessionEndpoint = `${baseEndpoint}/speech/time/:sessionId`;
app.get(getTotalSpeechTimesInSessionEndpoint, async (req, res) => {
  const { sessionId } = req.params;

  let response;

  try {
    if (sessionId === undefined) {
      return new Response(false, null, 400, "id must be defined");
    }

    let _data = await GetSpeakerDataInSession(sessionId);

    _data.data?.sort((a, b) => a.frameNumber - b.frameNumber);

    let speechInFrames = new Map([
      [Speaker.Instructor, 0],
      [Speaker.Student, 0],
      [Speaker.Ambient, 0],
    ]);

    let lastSpeaker = _data.data?.[0].speaker || Speaker.Student;
    let lastFramenumberSwitch = _data.data?.[0].frameNumber;

    _data.data?.forEach((frame) => {
      if (lastSpeaker !== frame.speaker) {
        speechInFrames.set(
          lastSpeaker,
          (speechInFrames.get(lastSpeaker) || 0) +
            frame.frameNumber -
            (lastFramenumberSwitch || 0)
        );

        //Switch Speakers
        lastSpeaker = frame.speaker;
        lastFramenumberSwitch = frame.frameNumber || lastFramenumberSwitch;
      }
    });

    // const framesData = _data.data;
    // let maxSpeakingTimePossible = 50 * 60; //base is 50 min classes;

    // if (framesData) {
    //   console.log(
    //     framesData[0].timestamp, //WTF, (User SLKB, 11/2) has 1944 timestamp???
    //     framesData[framesData.length - 1].timestamp
    //   );
    //   maxSpeakingTimePossible = framesData[0].timestamp.diff(
    //     framesData[framesData.length - 1].timestamp,
    //     "seconds"
    //   ).seconds; // Some issue, need to cap this for sanity check
    // }

    const cameraFPS = 15.0;

    response = new Response(true, {
      studentSpeechInSeconds:
        speechInFrames.get(Speaker.Student) || 0 / cameraFPS,
      instructorSpeechInSeconds:
        speechInFrames.get(Speaker.Instructor) || 0 / cameraFPS,
      ambiantNoiseInSeconds:
        speechInFrames.get(Speaker.Ambient) || 0 / cameraFPS,
    });
  } catch (error) {
    response = new Response(
      false,
      null,
      500,
      "Server error when getting total speech time"
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
