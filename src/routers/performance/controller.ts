import { SessionModel } from "../../models/sessionModel";
import { getCameraFPS } from "../engine";
import { Session } from "../sessions/types";
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
