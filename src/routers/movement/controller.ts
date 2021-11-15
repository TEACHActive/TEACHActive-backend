import { DateTime, Duration, DurationUnit } from "luxon";

import {
  InstructorMovementFrame,
  InstructorMovementFrameResponse,
} from "./types";
import { Response } from "../types";
import { chunkArray } from "../util";
import { getVideoFramesBySessionId } from "../engine";
import { BodyPart, Channel, VideoFrame } from "../sessions/types";

export const getInstructorMovementDataInSession = async (
  sessionId: string,
  numSegments: number = 100,
  durationUnit: DurationUnit = "minutes"
): Promise<Response<InstructorMovementFrameResponse[] | null>> => {
  const videoFrames = await getVideoFramesBySessionId(
    sessionId,
    Channel.Instructor
  );

  if (videoFrames.length === 0) {
    return new Response(false, null, 404, "No Instructor video frames");
  }

  const instructor = calculateInstructorInFrame(videoFrames[0]);
  const initialDateTime = videoFrames[0].timestamp;

  const instructorInFrames = videoFrames.map((frame: VideoFrame) => {
    //First look for previous tracking id in frame of instructor
    let instructorInCurrentFrame = frame.people.find(
      (person: any) => person.trackingId === instructor?.trackingId
    );
    if (!instructorInCurrentFrame) {
      //If that person is not found calculate the instructor again
      instructorInCurrentFrame = calculateInstructorInFrame(frame);
    }
    const timeDiff = frame.timestamp.diff(initialDateTime, durationUnit);

    return new InstructorMovementFrame({
      instructor: instructorInCurrentFrame,
      timestamp: frame.timestamp,
      frameNumber: frame.frameNumber,
      timeDiff: timeDiff.toObject(),
      foundInstructor: !!instructorInCurrentFrame,
    });
  });

  const chunkedInstructorMovementFrames = chunkArray(
    instructorInFrames,
    numSegments
  );

  const currDate = DateTime.fromJSDate(new Date());

  const defaultInstructorMovementStats = {
    timestamp: {
      begin: currDate.plus({ years: 100 }),
      end: currDate.minus({ years: 100 }),
    },
    frameNumber: {
      begin: Number.MAX_VALUE,
      avg: 0,
      end: Number.MIN_VALUE,
    },
    instructor: {
      avg: {
        xPos: 0,
        yPos: 0,
      },
      min: {
        xPos: Number.MAX_VALUE,
        yPos: Number.MAX_VALUE,
      },
      max: {
        xPos: Number.MIN_VALUE,
        yPos: Number.MIN_VALUE,
      },
    },
    timeDiff: Duration.fromMillis(0).toObject(),
  };

  const instructorMovementData = chunkedInstructorMovementFrames.map(
    (frameWindow) =>
      frameWindow.reduce((acc, frame, _, { length }) => {
        return {
          timestamp: {
            begin: DateTime.min(frame.timestamp, acc.timestamp.begin),
            end: DateTime.max(frame.timestamp, acc.timestamp.end),
          },
          timeDiff: frame.timeDiff,
          frameNumber: {
            begin: Math.min(frame.frameNumber, acc.frameNumber.begin),
            avg: acc.frameNumber.avg + frame.frameNumber / length,
            end: Math.max(frame.frameNumber, acc.frameNumber.end),
          },
          instructor: {
            avg: {
              xPos:
                acc.instructor.avg.xPos +
                (frame.instructor.xPos ||
                  defaultInstructorMovementStats.instructor.avg.xPos) /
                  length,
              yPos:
                acc.instructor.avg.yPos +
                (frame.instructor.yPos ||
                  defaultInstructorMovementStats.instructor.avg.yPos) /
                  length,
            },
            min: {
              xPos: Math.min(
                frame.instructor.xPos ||
                  defaultInstructorMovementStats.instructor.min.xPos,
                acc.instructor.min.xPos
              ),
              yPos: Math.min(
                frame.instructor.yPos ||
                  defaultInstructorMovementStats.instructor.min.yPos,
                acc.instructor.min.yPos
              ),
            },
            max: {
              xPos: Math.max(
                frame.instructor.xPos ||
                  defaultInstructorMovementStats.instructor.max.xPos,
                acc.instructor.min.xPos
              ),
              yPos: Math.max(
                frame.instructor.yPos ||
                  defaultInstructorMovementStats.instructor.max.yPos,
                acc.instructor.min.yPos
              ),
            },
          },
        };
      }, defaultInstructorMovementStats)
  );

  return new Response(true, instructorMovementData);
};

const calculateInstructorInFrame = (instructorFrame: VideoFrame) => {
  if (instructorFrame.people.length === 0) return undefined;
  const defaultPersonNeck = {
    x: -1,
    y: Number.MAX_SAFE_INTEGER,
    confident: false,
  };
  const minYPerson = instructorFrame.people.reduce((minYPerson, person) => {
    const currPersonNeck =
      person.body.bodyParts.get(BodyPart.Neck) || defaultPersonNeck;
    const minYPersonNeck =
      minYPerson.body.bodyParts.get(BodyPart.Neck) || defaultPersonNeck;
    if (currPersonNeck.y < minYPersonNeck.y) {
      return person;
    }
    return minYPerson;
  });
  return minYPerson;
};
