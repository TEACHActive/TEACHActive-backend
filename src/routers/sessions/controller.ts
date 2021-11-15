import { Channel, Session, VideoFrame } from "./types";
import { Response } from "../types";
import { SessionModel } from "../../models/sessionModel";
import {
  getCameraFPS,
  getVideoFramesBySessionId,
  isAdminRequest,
} from "../engine";
import { TokenSign } from "../user/types";

/**
 * Get sessions stored in Mongo
 * @param uid Optional: UserID to get matching sessions
 * @returns A response constaining a session[] or null if an error occured
 */
export const getSessions = async (
  uid: string,
  isAdminRequest: boolean
): Promise<Response<Session[] | null>> => {
  const filter = isAdminRequest ? {} : { keyword: uid };

  const sessionModels = await SessionModel.find(filter).exec();

  if (!sessionModels) {
    return new Response(false, null, 404, "Failed to get sessions");
  }

  const sessions = sessionModels.map(
    (session) => new Session(session, getCameraFPS())
  );
  const response = new Response<Session[]>(true, sessions);
  return response;
};

export const getVideoFramesInSession = async (
  sessionId: string,
  channel: Channel | null,
  tokenSign: TokenSign
): Promise<Response<VideoFrame[] | null>> => {
  if (!channel) {
    return new Response(false, null, 400, "Invalid channel name");
  }

  const userSessions = await getSessions(
    tokenSign.uid,
    isAdminRequest(tokenSign)
  );

  if (!userSessions.data) {
    return new Response(false, null, 403, "User has no sessions");
  }

  const userSession = userSessions.data.find(
    (session) => session.id === sessionId
  );
  if (!userSession) {
    return new Response(
      false,
      null,
      404,
      "No matching session for given sessionId and user"
    );
  }
  const videoFrames = await getVideoFramesBySessionId(userSession.id, channel);
  return new Response(true, videoFrames);
};
