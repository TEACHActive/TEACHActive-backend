import { Response } from "../types";
import { SpeechFrame, SpeechTotals } from "./types";

export const getStudentSpeechDataSession = async (
  sessionId: string,
  numSegments: number = 10
): Promise<Response<SpeechFrame[] | null>> => {
  return new Response(true, []);
};

export const getInstructorSpeechDataSession = async (
  sessionId: string,
  numSegments: number = 10
): Promise<Response<SpeechFrame[] | null>> => {
  return new Response(true, []);
};

export const getSpeechTotalsInSession = async (
  sessionId: string
): Promise<Response<SpeechTotals | null>> => {
  return new Response(true, new SpeechTotals({}));
};
