import { DurationUnit } from "luxon";
import { VideoFrame, BodyPart, ArmPose, Channel } from "./types";

export const calculateInstructorInFrame = (instructorFrame: VideoFrame) => {
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

export const calculateArmPosesFromFrames = (
  studentVideoFrames: VideoFrame[],
  durationUnit: DurationUnit
) => {
  const initialDateTime = studentVideoFrames[0].timestamp;

  const armPoseFrameCounts = studentVideoFrames.map((frame) => {
    const armPosePersonId = frame.people.map((person) => {
      return {
        pose: person.armpose,
        id: person.openposeId,
      };
    });
    return {
      timeDiff: frame.timestamp.diff(initialDateTime, durationUnit).toObject(),
      armPoseCount: {
        handsRaised: armPosePersonId.filter(
          (personPose) => personPose.pose === ArmPose.HandsRaised
        ).length,
        armsCrossed: armPosePersonId.filter(
          (personPose) => personPose.pose === ArmPose.ArmsCrossed
        ).length,
        error: armPosePersonId.filter(
          (personPose) => personPose.pose === ArmPose.Error
        ).length,
        handsOnFace: armPosePersonId.filter(
          (personPose) => personPose.pose === ArmPose.HandsRaised
        ).length,
        other: armPosePersonId.filter(
          (personPose) => personPose.pose === ArmPose.Other
        ).length,
      },
    };
  });

  return armPoseFrameCounts;
};

export const ParseChannel = (
  channel: string
): Channel.Instructor | Channel.Student | null => {
  if (channel !== Channel.Instructor && channel !== Channel.Student) {
    return null;
  }
  return channel;
};
