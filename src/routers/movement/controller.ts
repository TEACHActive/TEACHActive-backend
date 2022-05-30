import { DateTime, Duration, DurationUnit } from "luxon";

import {
  InstructorMovementFrame,
  InstructorMovementFrameResponse,
} from "./types";
import { Response } from "../types";
import { chunkArrayIntoUnits } from "../util";
import { BodyPart, VideoFrame } from "../sessions/types";

export const getInstructorMovementDataInSession = (
  videoFrames: VideoFrame[],
  chunkSizeInMinutes: number = 5,
  durationUnit: DurationUnit = "minutes"
): Response<InstructorMovementFrameResponse[] | null> => {
  const instructorInFrames = calculateInstructorInFrames(
    videoFrames,
    durationUnit
  );

  const chunkedVideoFrames = chunkArrayIntoUnits(
    instructorInFrames,
    chunkSizeInMinutes
  );

  if (chunkedVideoFrames.length === 0) {
    return new Response(false, null, 500, "No Instructor video frames");
  }

  // const chunkedInstructorMovementFrames = chunkArrayIntoNumberOfGroups(
  //   instructorInFrames,
  //   chunkSizeInMinutes
  // );

  const currDate = DateTime.fromJSDate(new Date());

  const defaultInstructorMovementStats = {
    timestamp: {
      begin: currDate.plus({ years: 100 }),
      end: currDate.minus({ years: 100 }),
    },
    frameNumber: {
      begin: Number.MAX_SAFE_INTEGER,
      avg: 0,
      end: Number.MIN_SAFE_INTEGER,
    },
    instructor: {
      avg: {
        xPos: 0,
        yPos: 0,
      },
      min: {
        xPos: Number.MAX_SAFE_INTEGER,
        yPos: Number.MAX_SAFE_INTEGER,
      },
      max: {
        xPos: Number.MIN_SAFE_INTEGER,
        yPos: Number.MIN_SAFE_INTEGER,
      },
    },
    timeDiff: Duration.fromMillis(0).toObject(),
  };

  const instructorMovementData = chunkedVideoFrames.map((frameWindow) =>
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

/**
 * Gets the percentage (0-1) of frames that the instructor was identifed in
 * @param videoFrames
 */
export const getInstructorFoundPercentageInSession = (
  videoFrames: VideoFrame[]
): Response<number> => {
  const instructorInFrames = calculateInstructorInFrames(
    videoFrames,
    "minutes"
  );

  return new Response(
    true,
    instructorInFrames.filter(
      (instructorMovementFrame) => instructorMovementFrame.foundInstructor
    ).length / instructorInFrames.length
  );
};

const calculateInstructorInFrames = (
  videoFrames: VideoFrame[],
  durationUnit: DurationUnit = "minutes"
): InstructorMovementFrame[] => {
  const instructor = calculateInstructorInFrame(videoFrames[0]);
  const initialDateTime = videoFrames[0].timestamp;

  return videoFrames.map((frame: VideoFrame) => {
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
};

//Todo: Update this to something more robust
/**
 * Trys to calculate the current instructor in the video frame hueristically
 * @param instructorFrame
 * @returns
 */
const calculateInstructorInFrame = (instructorFrame: VideoFrame) => {
  // If no one is in the frame, there is no instructor
  if (instructorFrame.people.length === 0) return undefined;
  // We try to evaluate by the tracked neck position
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
