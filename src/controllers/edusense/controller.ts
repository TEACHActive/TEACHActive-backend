import axios from "axios";
import { DurationUnit } from "luxon";
import { SessionModel } from "../../models/sessionModel";
import { Response } from "../types";
import { getAxiosConfig } from "../util";
import {
  BaseSession,
  BodyPart,
  Channel,
  SessionResponse,
  SitStand,
  VideoFrameSession,
} from "./types";
import {
  calculateArmPosesFromFrames,
  calculateInstructorInFrame,
} from "./util";

export const getSessionsByUID = async (uid: string) => {
  const data = JSON.stringify({
    query: `{
                sessions(keyword: "${uid}") { 
                    id
                    createdAt {
                        unixSeconds
                    }
                }
            }`,
    variables: {},
  });

  const config = getAxiosConfig("post", "/query", data);

  const response = await axios.request(config);
  const baseSessionResponse = new SessionResponse<BaseSession>(
    {
      sessions: JSON.parse(response.data.response).data.sessions,
      success: response.data.success,
    },
    BaseSession
  );
  if (!baseSessionResponse.success) {
    return new Response(false, null, 404, "Failed to get sessions");
  }
  return new Response(true, baseSessionResponse.sessions);
};

export const getSessionsWithMetadataByUID = async (uid: string) => {
  const sessions = await SessionModel.find({ keyword: uid }).exec();
  const baseSessionResponse = new SessionResponse<BaseSession>(
    {
      sessions: sessions,
      success: true,
    },
    BaseSession
  );
  if (!baseSessionResponse.success) {
    return new Response(false, null, 404, "Failed to get sessions");
  }
  return new Response(true, baseSessionResponse.sessions);
};

export const getArmPosesInSession = async (
  sessionId: string,
  durationUnit: DurationUnit = "minutes"
) => {
  const framesResponse = await getFramesBySessionId(sessionId, Channel.Student);
  if (!framesResponse.success || !framesResponse.data) {
    return framesResponse;
  }

  const studentVideoFrames = framesResponse.data[0].videoFrames;

  if (studentVideoFrames.length === 0) {
    return new Response(
      false,
      null,
      404,
      "No student video frames for session"
    );
  }

  const armPoseFrameCounts = calculateArmPosesFromFrames(
    studentVideoFrames,
    durationUnit
  );

  return new Response(true, armPoseFrameCounts);
};

export const getNumberOfFramesOfArmPosesInSession = async (
  sessionId: string,
  durationUnit: DurationUnit = "minutes"
) => {
  const framesResponse = await getFramesBySessionId(sessionId, Channel.Student);
  if (!framesResponse.success || !framesResponse.data) {
    return framesResponse;
  }

  const studentVideoFrames = framesResponse.data[0].videoFrames;

  if (studentVideoFrames.length === 0) {
    return new Response(
      false,
      null,
      404,
      "No student video frames for session"
    );
  }

  const armPoseFrameCounts = calculateArmPosesFromFrames(
    studentVideoFrames,
    durationUnit
  );

  const cummulativeArmPoses = armPoseFrameCounts.reduce(
    (acc, curVal) => {
      return {
        handsRaised: (acc.handsRaised += curVal.armPoseCount.handsRaised),
        armsCrossed: (acc.armsCrossed += curVal.armPoseCount.armsCrossed),
        error: (acc.error += curVal.armPoseCount.error),
        handsOnFace: (acc.handsOnFace += curVal.armPoseCount.handsOnFace),
        other: (acc.other += curVal.armPoseCount.other),
      };
    },
    {
      handsRaised: 0,
      armsCrossed: 0,
      error: 0,
      handsOnFace: 0,
      other: 0,
    }
  );

  return new Response(true, cummulativeArmPoses);
};

export const getStudentAttendenceStatsInSession = async (sessionId: string) => {
  const framesResponse = await getFramesBySessionId(sessionId, Channel.Student);
  if (!framesResponse.success || !framesResponse.data) {
    return framesResponse;
  }

  const studentVideoFrames = framesResponse.data[0].videoFrames;

  const statsStudentsDetected = studentVideoFrames.reduce(
    (acc, frame, _, { length }) => {
      const studentsInFrame = frame.people.length;
      const max = Math.max(acc.max, studentsInFrame);
      const min = Math.min(acc.min, studentsInFrame);
      const avg = acc.avg + studentsInFrame / length;
      return {
        max: max,
        min: min,
        avg: avg,
      };
    },
    {
      max: 0,
      min: 0,
      avg: 0,
    }
  );

  const avgSquareDiff = studentVideoFrames.reduce(
    (acc, frame, _, { length }) => {
      var diff = frame.people.length - statsStudentsDetected.avg;
      var sqrDiff = diff * diff;
      const avgSqrDiff = acc + sqrDiff / length;
      return avgSqrDiff;
    },
    0
  );

  return new Response(true, {
    ...statsStudentsDetected,
    stdDev: Math.sqrt(avgSquareDiff),
  });
};

export const getInstructorMovementInSession = async (
  sessionId: string,
  durationUnit: DurationUnit = "minutes"
) => {
  const framesResponse = await getFramesBySessionId(
    sessionId,
    Channel.Instructor
  );
  if (!framesResponse.success || !framesResponse.data) {
    return framesResponse;
  }

  const instructorVideoFrames = framesResponse.data[0].videoFrames;

  if (instructorVideoFrames.length === 0) {
    return new Response(false, null, 404, "No instructor video frames");
  }

  let instructor = calculateInstructorInFrame(instructorVideoFrames[0]);
  const initialDateTime = instructorVideoFrames[0].timestamp;

  const instructorInFrames = instructorVideoFrames.map((frame) => {
    //First look for previous tracking id in frame of instructor
    let instructorInCurrentFrame = frame.people.find(
      (person) => person.trackingId === instructor?.trackingId
    );
    if (!instructorInCurrentFrame) {
      //If that person is not found calculate the instructor again
      instructorInCurrentFrame = calculateInstructorInFrame(frame);
    }
    return {
      instructor: instructorInCurrentFrame,
      timestamp: frame.timestamp.diff(initialDateTime, durationUnit).toObject(),
    };
  });

  const instructorXPosInFrames = instructorInFrames.map((instructorFrame) => {
    return {
      xPos: instructorFrame.instructor?.body.bodyParts.get(BodyPart.Neck)?.x,
      timestamp: instructorFrame.timestamp,
    };
  });

  return new Response(true, instructorXPosInFrames);
};

export const getStudentSitVsStandInSession = async (
  sessionId: string,
  durationUnit: DurationUnit = "minutes"
) => {
  const framesResponse = await getFramesBySessionId(sessionId, Channel.Student);
  if (!framesResponse.success || !framesResponse.data) {
    return framesResponse;
  }

  const studentVideoFrames = framesResponse.data[0].videoFrames;

  if (studentVideoFrames.length === 0) {
    return new Response(false, null, 404, "No student video frames");
  }
  const initialDateTime = studentVideoFrames[0].timestamp;

  const sitStandData = studentVideoFrames.map((frame) => {
    const sitStandNumbers = frame.people.reduce(
      (acc, person) => {
        return {
          sitNumber: acc.sitNumber + (person.sitStand === SitStand.Sit ? 1 : 0),
          standNumber:
            acc.standNumber + (person.sitStand === SitStand.Stand ? 1 : 0),
          errorNumber:
            acc.errorNumber + (person.sitStand === SitStand.Error ? 1 : 0),
        };
      },
      {
        sitNumber: 0,
        standNumber: 0,
        errorNumber: 0,
      }
    );

    return {
      sitStand: sitStandNumbers,
      timeDiff: frame.timestamp.diff(initialDateTime, durationUnit).toObject(),
    };
  });

  return new Response(true, sitStandData);
};

export const getFramesBySessionId = async (
  sessionID: string,
  channel: Channel
) => {
  const data = JSON.stringify({
    query: `{
                  sessions(sessionId: "${sessionID}") { 
                      id
                      createdAt { 
                        unixSeconds
                      }
                      videoFrames(schema: "0.1.0", channel: ${channel}) { 
                          frameNumber
                          timestamp {
                              unixSeconds
                          }
                          people { 
                              openposeId 
                              body
                              inference { 
                                  trackingId 
                                  posture { 
                                      armPose 
                                      sitStand
                                  }
                              }
                          } 
                      }
                  }
              }`,
    variables: {},
  });

  const config = getAxiosConfig("post", "/query", data);

  const response = await axios.request(config);

  const edusenseResponse = JSON.parse(response.data.response);

  const videoFrameSessionResponse = new SessionResponse<VideoFrameSession>(
    {
      sessions:
        edusenseResponse && edusenseResponse.data
          ? edusenseResponse.data.sessions
          : null,
      success: response.data.success,
    },
    VideoFrameSession
  );
  if (
    !videoFrameSessionResponse.success ||
    !videoFrameSessionResponse.sessions
  ) {
    return new Response(false, null, 404, "Failed to get frames");
  }

  if (videoFrameSessionResponse.sessions.length === 0) {
    return new Response(
      false,
      null,
      500,
      "Failed to get student frames, empty session"
    );
  }

  return new Response(true, videoFrameSessionResponse.sessions);
};
