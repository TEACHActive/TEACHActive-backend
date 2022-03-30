import { Response } from "../types";
import * as Const from "../../variables";
import { AttendanceStats } from "./types";
import { Session, VideoChannel, VideoFrame } from "../sessions/types";
import { getSessionById, getVideoFramesBySessionId } from "../engine";

export const getAttendanceFromVideoFrames = (
  videoFrames: VideoFrame[]
): Response<AttendanceStats | null> => {
  if (videoFrames.length === 0) {
    return new Response(false, null, 404, "No video frames");
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

export const getAttendanceFromVideoFramesInMultipleSessions = async (
  sessionIds: string[],
  isAdminRequest: boolean,
  uid: string
): Promise<
  Response<
    {
      data?: AttendanceStats;
      session?: Session;
    }[]
  >
> => {
  const dataArray = await Promise.all(
    sessionIds.map(async (sessionId: string) => {
      const videoFrames = await getVideoFramesBySessionId(
        sessionId,
        VideoChannel.Student,
        {
          username: Const.DB_USER,
          password: Const.DB_PASS,
        }
      );
      const result = getAttendanceFromVideoFrames(videoFrames);

      const session = await getSessionById(sessionId, uid, isAdminRequest);

      return {
        session: session.data || undefined,
        data: result.data || undefined,
      };
    })
  );

  return new Response(true, dataArray);
};
