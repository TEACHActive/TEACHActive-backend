import { Response } from "../types";
import { AttendanceStats } from "./types";
import { Channel } from "../sessions/types";
import { getVideoFramesBySessionId } from "../engine";

export const getAttendanceInSession = async (
  sessionId: string
): Promise<Response<AttendanceStats | null>> => {
  const videoFrames = await getVideoFramesBySessionId(
    sessionId,
    Channel.Student
  );

  if (videoFrames.length === 0) {
    return new Response(false, null, 404, "No Student video frames");
  }
  const defaultAttendance = {
    avg: 0,
    min: Number.MAX_SAFE_INTEGER,
    max: Number.MIN_SAFE_INTEGER,
  };

  const attendanceStats = videoFrames.reduce((acc, frame, _, { length }) => {
    return {
      avg: acc.avg + frame.people.length / length,
      min: Math.min(acc.min, frame.people.length),
      max: Math.max(acc.max, frame.people.length),
    };
  }, defaultAttendance);

  return new Response(true, attendanceStats);
};
