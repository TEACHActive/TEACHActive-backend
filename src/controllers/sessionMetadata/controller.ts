import { SessionModel } from "../../models/sessionModel";
import { BaseSession } from "../edusense/types";
import { Response } from "../types";

export const getPerformanceBySessionId = async (sessionId: string) => {
  const session = await SessionModel.findById(sessionId).exec();

  if (!session) {
    return new Response(false, null, 404, "No sessions with matching id found");
  }

  const baseSession = new BaseSession(session);

  if (!baseSession.performance) {
    return new Response(false, null, 404, "No preformance set for session");
  }

  return new Response(true, baseSession);
};

export const updatePerformanceBySessionId = async (
  sessionId: string,
  preformance: number
) => {
  const updatedSession = await SessionModel.findByIdAndUpdate(
    sessionId,
    {
      $set: { "metadata.preformance": preformance },
    },
    { new: true }
  ).exec();

  if (!updatedSession) {
    return new Response(false, null, 404, "No sessions with matching id found");
  }

  const baseSession = new BaseSession(updatedSession);

  if (!baseSession.performance) {
    return new Response(false, null, 404, "No preformance set for session");
  }

  return new Response(true, baseSession);
};

export const updateNameBySessionId = async (
  sessionId: string,
  name: string
) => {
  const updatedSession = await SessionModel.findByIdAndUpdate(
    sessionId,
    {
      $set: { "metadata.name": name },
    },
    { new: true }
  ).exec();

  if (!updatedSession) {
    return new Response(false, null, 404, "No sessions with matching id found");
  }

  const baseSession = new BaseSession(updatedSession);

  if (!baseSession.name) {
    return new Response(false, null, 404, "No name set for session");
  }

  return new Response(true, baseSession);
};
