import { Response } from "../types";
import { Session } from "./types";
import { getCameraFPS } from "../engine";
import { SessionModel } from "../../models/sessionModel";

/**
 * Get sessions stored in Mongo
 * @param uid Optional: UserID to get matching sessions
 * @returns A response constaining a session[] or null if an error occured
 */
export const getSessions = async (
  uid: string,
  isAdminRequest: boolean,
  limit: number = 0,
  sortDesc: boolean = false
): Promise<Response<Session[] | null>> => {
  const filter = isAdminRequest ? {} : { keyword: uid };
  const sessionModels = await SessionModel.find(filter)
    .sort({ timestamp: sortDesc ? -1 : 1 })
    .limit(limit)
    .exec();
  if (!sessionModels) {
    return new Response(false, null, 404, "Failed to get sessions");
  }
  const sessions = sessionModels.map(
    (session) => new Session(session, getCameraFPS())
  );
  const response = new Response<Session[]>(true, sessions);
  return response;
};

export const updateSessionNameBySessionId = async (
  sessionId: string,
  name: string
): Promise<Response<Session | null>> => {
  const result = await SessionModel.findByIdAndUpdate(
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

  if (!result) {
    return new Response(false, null, 500, "Failed to update session name");
  }
  return new Response(true, new Session(result, getCameraFPS()));
};

// export const getVideoFramesInSession = async (
//   sessionId: string,
//   channel: VideoChannel | null,
//   userSessions?: Session[]
// ): Promise<Response<VideoFrame[] | null>> => {
//   if (!channel) {
//     return new Response(false, null, 400, "Invalid channel name");
//   }

//   if (!userSessions) {
//     return new Response(false, null, 403, "User has no sessions");
//   }

//   const userSession = userSessions.find((session) => session.id === sessionId);
//   if (!userSession) {
//     return new Response(
//       false,
//       null,
//       404,
//       "No matching session for given sessionId and user"
//     );
//   }

//   return new Response(true, videoFrames);
// };

// export const getAudioFramesInSession = async (
//   sessionId: string,
//   channel: AudioChannel | null,
//   userSessions?: Session[]
// ): Promise<Response<AudioFrame[] | null>> => {
//   if (!channel) {
//     return new Response(false, null, 400, "Invalid channel name");
//   }

//   if (!userSessions) {
//     return new Response(false, null, 403, "User has no sessions");
//   }

//   const userSession = userSessions.find((session) => session.id === sessionId);
//   if (!userSession) {
//     return new Response(
//       false,
//       null,
//       404,
//       "No matching session for given sessionId and user"
//     );
//   }
//   const audioFrames = await getAudioFramesBySessionId(userSession.id, channel);
//   return new Response(true, audioFrames);
// };
