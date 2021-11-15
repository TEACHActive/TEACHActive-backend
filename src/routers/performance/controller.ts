import { Response } from "../types";
import { SessionPerformance } from "./types";

export const getSessionPerformanceInSession = (
  sessionId: string,
  numSegments: number = 10
): Response<SessionPerformance | null> => {
  return new Response(
    true,
    new SessionPerformance({
      performance: 5,
    })
  );
};
