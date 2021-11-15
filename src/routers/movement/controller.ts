import { Response } from "../types";
import { InstructorMovementFrame } from "./types";

export const getInstructorMovementDataInSession = (
  sessionId: string,
  numSegments: number = 10
): Response<InstructorMovementFrame[] | null> => {
  return new Response(true, []);
};
