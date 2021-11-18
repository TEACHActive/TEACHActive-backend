import axios from "axios";
import { DateTime } from "luxon";

import { MethodType } from "./types";
import { getAxiosConfig } from "./util";
import { TokenSign } from "./user/types";
import * as Constants from "../variables";
import { AudioFrame, Channel, VideoFrame } from "./sessions/types";
import { getSessions } from "./sessions/controller";

export const getCameraFPS = (): number => {
  return 15; //Todo: get actual fps
};

export const ParseChannel = (channel: string): Channel | null => {
  if (channel !== Channel.Instructor && channel !== Channel.Student) {
    return null;
  }
  return channel;
};

export const isAdminRequest = (tokenSign: TokenSign): boolean => {
  return Constants.ADMIN_LIST.includes(tokenSign.uid);
};

export const userOwnsSession = async (
  sessionId: string,
  tokenSign: TokenSign
): Promise<boolean> => {
  const isAdminRequest = Constants.ADMIN_LIST.includes(tokenSign.uid);
  if (isAdminRequest) return true;

  const userSessions = await getSessions(tokenSign.uid, isAdminRequest);
  if (!userSessions.data) {
    return false;
  }
  const matchingSession = userSessions.data.find(
    (session) => session.id === sessionId
  );
  if (matchingSession) {
    return true;
  }
  return false;
};

export const getVideoFramesBySessionId = async (
  sessionID: string,
  channel: Channel,
  serialize: boolean = false
): Promise<VideoFrame[]> => {
  const data = JSON.stringify({
    query: `{
                  sessions(sessionId: "${sessionID}") { 
                      id
                      createdAt { 
                        RFC3339
                      }
                      videoFrames(schema: "0.1.0", channel: ${channel}) { 
                          frameNumber
                          timestamp {
                            RFC3339
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
  const config = getAxiosConfig(MethodType.Post, "/query", data);

  const response = await axios.request(config);

  const edusenseResponse = JSON.parse(response.data.response);

  if (
    !edusenseResponse.data ||
    !edusenseResponse.data.sessions ||
    !Array.isArray(edusenseResponse.data.sessions) ||
    edusenseResponse.data.sessions.length === 0
  ) {
    throw Error("Error when getting sesssions, no matching session");
  }

  const sessions = edusenseResponse.data.sessions;

  if (
    !sessions[0].videoFrames ||
    !Array.isArray(sessions[0].videoFrames) ||
    sessions[0].videoFrames.length === 0
  ) {
    throw Error("Error when getting videoFrames, no frames");
  }

  const videoFrames = sessions[0].videoFrames;

  const initialDateTime = DateTime.fromISO(videoFrames[0].timestamp.RFC3339);

  const parsedVideoFrames: VideoFrame[] = videoFrames
    .map((videoFrame: any, i: number) => {
      if (i % 5 === 0) {
        return null;
      }
      const frame = new VideoFrame(videoFrame, initialDateTime, getCameraFPS());
      if (serialize) {
        return frame.serialize();
      }
      return frame;
    })
    .filter((frame: any) => !!frame);

  return parsedVideoFrames;
};

export const getAudioFramesBySessionId = async (
  sessionID: string,
  channel: Channel,
  serialize: boolean = false
): Promise<AudioFrame[]> => {
  let edusenseResponse = await makeAudioFrameQuery(sessionID, channel);

  if (!edusenseResponse.data) {
    edusenseResponse = await makeAudioFrameQuery(
      sessionID,
      channel,
      "edusense-audio"
    );
  }

  if (
    !edusenseResponse.data ||
    !edusenseResponse.data.sessions ||
    !Array.isArray(edusenseResponse.data.sessions) ||
    edusenseResponse.data.sessions.length === 0
  ) {
    throw new Error("Error when getting sesssions, no matching session");
  }

  const sessions = edusenseResponse.data.sessions;

  if (
    !sessions[0].audioFrames ||
    !Array.isArray(sessions[0].audioFrames) ||
    sessions[0].audioFrames.length === 0
  ) {
    throw new Error("Error when getting audioFrames, no frames");
  }

  const audioFrames = sessions[0].audioFrames;

  const initialDateTime = DateTime.fromISO(audioFrames[0].timestamp.RFC3339);

  const parsedAudioFrames: AudioFrame[] = audioFrames.map((audioFrame: any) => {
    const frame = new AudioFrame(audioFrame, initialDateTime, getCameraFPS());
    if (serialize) {
      return frame.serialize();
    }
    return frame;
  });

  return parsedAudioFrames;
};

const makeAudioFrameQuery = async (
  sessionID: string,
  channel: Channel,
  schema: string = "0.1.0"
) => {
  const data = JSON.stringify({
    query: `{
      sessions(sessionId: "${sessionID}") {
          createdAt {
              RFC3339
          }
          audioFrames(schema: "${schema}", channel: ${channel}) {
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
  const config = getAxiosConfig(MethodType.Post, "/query", data);

  const response = await axios.request(config);

  const edusenseResponse = JSON.parse(response.data.response);

  return edusenseResponse;
};
