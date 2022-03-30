import { SessionModel } from "../../models/sessionModel";
import { getCameraFPS, getSessionById } from "../engine";
import { Session, VideoChannel } from "../sessions/types";
import { Response } from "../types";
import { SessionPerformance } from "./types";

export const getSessionPerformanceForSession = async (
  sessionId: string
): Promise<Response<SessionPerformance | null>> => {
  const filter = { _id: sessionId };

  const sessionModel = await SessionModel.findOne(filter).exec();
  if (!sessionModel) {
    return new Response(false, null, 404, "Failed to find matching session");
  }

  const matchingSession = new Session(sessionModel.toObject(), getCameraFPS());

  return new Response(
    true,
    new SessionPerformance({
      sessionId: sessionId,
      performance: matchingSession.performance,
    })
  );
};

export const getSessionPerformanceInMultipleSessions = async (
  sessionIds: string[],
  isAdminRequest: boolean,
  uid: string
): Promise<
  Response<
    {
      data?: SessionPerformance;
      session?: Session;
    }[]
  >
> => {
  const dataArray = await Promise.all(
    sessionIds.map(async (sessionId: string) => {
      const result = await getSessionPerformanceForSession(sessionId);

      const session = await getSessionById(sessionId, uid, isAdminRequest);

      return {
        session: session.data || undefined,
        data: result.data || undefined,
      };
    })
  );

  return new Response(true, dataArray);
};

export const setSessionPerformanceForSession = async (
  sessionId: string,
  performance: string
) => {
  const updatedSessionModel = await SessionModel.findByIdAndUpdate(
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
  ).exec();

  if (!updatedSessionModel) {
    return new Response(false, null, 404, "Session not found");
  }

  return new Response(true, new Session(updatedSessionModel, getCameraFPS()));
};
