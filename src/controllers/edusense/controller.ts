import axios from "axios";
import { DateTime, DurationObject, DurationUnit } from "luxon";

import {
  Channel,
  SitStand,
  BodyPart,
  BaseSession,
  SessionResponse,
  VideoFrameSession,
  AudioFrameSession,
  VideoFrame,
  AudioFrame,
  Speaker,
} from "./types";
import {
  calculateInstructorInFrame,
  calculateArmPosesFromFrames,
} from "./util";
import { Response } from "../types";
import { getAxiosConfig } from "../util";
import { SessionModel } from "../../models/sessionModel";

export const getAllSessions = async () => {
  const data = JSON.stringify({
    query: `{
                sessions { 
                    id
                    createdAt {
                        unixSeconds
                    }
                    keyword
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

export const getSessionsByUID = async (uid: string) => {
  const data = JSON.stringify({
    query: `{
                sessions(keyword: "${uid}") { 
                    id
                    createdAt {
                        unixSeconds
                    }
                    keyword
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

export const getAllSessionsWithMetadata = async () => {
  const sessions = await SessionModel.find().exec();
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
  const framesResponse = await getVideoFramesBySessionId(
    sessionId,
    Channel.Student
  );
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
  const framesResponse = await getVideoFramesBySessionId(
    sessionId,
    Channel.Student
  );
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
  const framesResponse = await getVideoFramesBySessionId(
    sessionId,
    Channel.Student
  );
  if (!framesResponse.success || !framesResponse.data) {
    return framesResponse;
  }

  const studentVideoFrames = framesResponse.data[0].videoFrames;
  const statsStudentsDetected = studentVideoFrames.reduce(
    (acc: any, frame: any, _: any, data: any) => {
      const studentsInFrame = frame.people.length;
      const max = Math.max(acc.max, studentsInFrame);
      const min = Math.min(acc.min, studentsInFrame);
      const avg = acc.avg + studentsInFrame / data.length;
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
    (acc: any, frame: any, _: any, data: any) => {
      var diff = frame.people.length - statsStudentsDetected.avg;
      var sqrDiff = diff * diff;
      const avgSqrDiff = acc + sqrDiff / data.length;
      return avgSqrDiff;
    },
    0
  );

  const response = new Response(true, {
    ...statsStudentsDetected,
    stdDev: Math.sqrt(avgSquareDiff),
  });

  return response;
};

export const getInstructorMovementInSession = async (
  sessionId: string,
  durationUnit: DurationUnit = "minutes"
) => {
  const framesResponse = await getVideoFramesBySessionId(
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

  const instructorInFrames = instructorVideoFrames.map((frame: VideoFrame) => {
    //First look for previous tracking id in frame of instructor
    let instructorInCurrentFrame = frame.people.find(
      (person: any) => person.trackingId === instructor?.trackingId
    );
    if (!instructorInCurrentFrame) {
      //If that person is not found calculate the instructor again
      instructorInCurrentFrame = calculateInstructorInFrame(frame);
    }
    let timeDiff = frame.timestamp
      .diff(initialDateTime, durationUnit)
      .toObject();
    timeDiff[durationUnit] = Math.round(timeDiff[durationUnit] || 0);
    return {
      instructor: instructorInCurrentFrame,
      timestamp: frame.timestamp,
      timeDiff: timeDiff,
    };
  });

  let instructorXPosInFrames = instructorInFrames.map(
    (instructorFrame: any) => {
      return {
        xPos: instructorFrame.instructor?.body.bodyParts.get(BodyPart.Neck)?.x,
        timestamp: instructorFrame.timestamp,
        timeDiff: instructorFrame.timeDiff,
      };
    }
  );

  instructorXPosInFrames.sort((a, b) => a.timestamp - b.timestamp);

  return new Response(true, instructorXPosInFrames);
};

export const getStudentSitVsStandInSession = async (
  sessionId: string,
  durationUnit: DurationUnit = "minutes"
) => {
  const framesResponse = await getVideoFramesBySessionId(
    sessionId,
    Channel.Student
  );
  if (!framesResponse.success || !framesResponse.data) {
    return framesResponse;
  }

  const studentVideoFrames = framesResponse.data[0].videoFrames;

  if (studentVideoFrames.length === 0) {
    return new Response(false, null, 404, "No student video frames");
  }
  const initialDateTime = studentVideoFrames[0].timestamp;

  console.log(initialDateTime.toJSDate());
  console.log(
    studentVideoFrames[studentVideoFrames.length - 1].timestamp.toJSDate()
  );

  const sitStandData = studentVideoFrames.map((frame: any) => {
    const sitStandNumbers = frame.people.reduce(
      (acc: any, person: any) => {
        const personHasLowerBody =
          person.body.bodyParts.get(BodyPart.RAnkle)?.confident &&
          person.body.bodyParts.get(BodyPart.LAnkle)?.confident;
        if (!personHasLowerBody && person.sitStand === SitStand.Error) {
          //We will quantify this as a sit pose since there are some desks that occulude lower bodies
          return {
            ...acc,
            sitNumber: ++acc.sitNumber,
          };
        }
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

    let timeDiff = frame.timestamp
      .diff(initialDateTime, durationUnit)
      .toObject();
    timeDiff[durationUnit] = Math.round(timeDiff[durationUnit] || 0);

    return {
      sitStand: sitStandNumbers,
      timeDiff: timeDiff,
    };
  });

  return new Response(true, sitStandData);
};

export const getVideoFramesBySessionId = async (
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

  // return edusenseResponse;
  // console.log(edusenseResponse);

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

export const getAudioFramesBySessionId = async (
  sessionID: string,
  channel: Channel
) => {
  const data = JSON.stringify({
    query: `{
                  sessions(sessionId: "${sessionID}") { 
                      id
                      createdAt { 
                        RFC3339
                      }
                      audioFrames(schema: "0.1.0", channel: ${channel}) {
                          frameNumber
                          timestamp {
                            RFC3339
                          }
                          audio {
                              amplitude
                          }
                      }
                  }
              }`,
    variables: {},
  });

  const config = getAxiosConfig("post", "/query", data);

  const response = await axios.request(config);

  const edusenseResponse = JSON.parse(response.data.response);

  const audioFrameSessionResponse = new SessionResponse<AudioFrameSession>(
    {
      sessions:
        edusenseResponse && edusenseResponse.data
          ? edusenseResponse.data.sessions
          : null,
      success: response.data.success,
    },
    AudioFrameSession
  );
  if (
    !audioFrameSessionResponse.success ||
    !audioFrameSessionResponse.sessions
  ) {
    return new Response(false, null, 404, "Failed to get audio frames");
  }

  if (audioFrameSessionResponse.sessions.length === 0) {
    return new Response(
      false,
      null,
      500,
      "Failed to get student frames, empty session"
    );
  }

  return new Response(true, audioFrameSessionResponse.sessions[0].audioFrames);
};

export const getSpeechFrameNumberInSession = async (
  sessionID: string,
  channel: Channel,
  threashold: number
) => {
  const fps = 15;
  const secPerMin = 60;

  return await getAudioFramesBySessionId(sessionID, channel);
};

export const setSessionName = async (sessionId: string, name: string) => {
  const doc = await SessionModel.findByIdAndUpdate(
    sessionId,
    [
      {
        $set: {
          "metadata.name": {
            $ifNull: [name, name],
          },
        },
      },
    ],
    { new: true }
  );

  return new Response(true, new BaseSession(doc));
};

export const setSessionPerformance = async (
  sessionId: string,
  performance: string
) => {
  const doc = await SessionModel.findByIdAndUpdate(
    sessionId,
    [
      {
        $set: {
          "metadata.performance": {
            $ifNull: [performance, performance],
          },
        },
      },
    ],
    { new: true }
  );

  if (doc === null) {
    return new Response(false, null, 404, "Session not found");
  }

  return new Response(true, new BaseSession(doc));
};

export const GetSpeakerDataInSession = async (
  sessionId: string,
  minSpeakingAmp: number = 0.005
): Promise<
  | Response<null>
  | Response<
      {
        frameNumber: number;
        speaker: Speaker;
        timeDiff: DurationObject;
        timestamp: DateTime;
      }[]
    >
> => {
  let studentAudioFrames, instructorAudioFrames, response;
  instructorAudioFrames = await getAudioFramesBySessionId(
    sessionId,
    Channel.Instructor
  );
  studentAudioFrames = await getAudioFramesBySessionId(
    sessionId,
    Channel.Student
  );

  if (
    instructorAudioFrames.data &&
    instructorAudioFrames.data.length > 0 &&
    studentAudioFrames.data &&
    studentAudioFrames.data.length > 0
  ) {
    const instructorInitialDateTime = instructorAudioFrames.data[0].timestamp;
    const studentInitialDateTime = studentAudioFrames.data[0].timestamp;
    instructorAudioFrames = instructorAudioFrames.data.map(
      (frame: AudioFrame) => {
        let timeDiff = frame.timestamp
          .diff(instructorInitialDateTime, "seconds")
          .toObject();
        timeDiff["seconds"] = Math.round(timeDiff["seconds"] || 0);

        return {
          ...frame,
          timeDiff: timeDiff,
        };
      }
    );

    studentAudioFrames = studentAudioFrames.data.map((frame: AudioFrame) => {
      let timeDiff = frame.timestamp
        .diff(studentInitialDateTime, "seconds")
        .toObject();
      timeDiff["seconds"] = Math.round(timeDiff["seconds"] || 0);

      return {
        ...frame,
        timeDiff: timeDiff,
      };
    });

    let speakerData = [];
    for (
      let i = 0;
      i < Math.min(instructorAudioFrames.length, studentAudioFrames.length);
      i++
    ) {
      const insAmp = instructorAudioFrames[i].amplitude;
      const stuAmp = studentAudioFrames[i].amplitude;
      let timeDiff = instructorAudioFrames[i].timestamp
        .diff(instructorInitialDateTime, "seconds")
        .toObject();
      timeDiff["seconds"] = Math.round(timeDiff["seconds"] || 0);

      let speaker;
      if (insAmp < minSpeakingAmp && stuAmp < minSpeakingAmp) {
        speaker = Speaker.Ambient;
      } else {
        speaker = insAmp > stuAmp ? Speaker.Instructor : Speaker.Student;
      }

      speakerData.push({
        frameNumber: instructorAudioFrames[i].frameNumber,
        speaker: speaker,
        timeDiff: timeDiff,
        timestamp: instructorAudioFrames[i].timestamp,
      });
    }
    response = new Response(true, speakerData);
  } else {
    //Do something...
    response = new Response(
      false,
      null,
      500,
      "Either Instructor or Student frames null or empty"
    );
  }
  return response;
};
