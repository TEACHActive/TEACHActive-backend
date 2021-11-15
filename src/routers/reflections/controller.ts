import { Response } from "../types";
import { ReflectionSection } from "./types";

export const getReflectionSectionsForSession = (
  sessionId: string
): Response<ReflectionSection[] | null> => {
  return new Response(true, []);
};
