import { Response } from "../types";
import { ArmPoseData } from "./types";
import { getCameraFPS } from "../engine";
import { chunkArrayIntoNumberOfGroups } from "../util";
import { ArmPose, Person, VideoFrame } from "../sessions/types";

export const getArmPoseTotalsInSession = (
  videoFrames: VideoFrame[],
  durationUnit: "seconds" | "minutes" = "seconds"
): Response<ArmPoseData | null> => {
  const armPoseMap = countArmPosesFromFrames(videoFrames).reduce(
    (map: Map<string, number>, frameCountMap) => {
      Object.keys(frameCountMap.countMap).map((key) => {
        map.set(key, (map.get(key) || 0) + frameCountMap.countMap[key]);
      });
      return map;
    },
    new Map()
  );

  //convert frames to seconds
  let armPoseStatsInSecondsMap = new Map();
  Object.keys(Object.fromEntries(armPoseMap)).forEach((key) => {
    const statInFrames = armPoseMap.get(key);
    switch (durationUnit) {
      // Convert to correct unit of time
      case "minutes":
        armPoseStatsInSecondsMap.set(
          key,
          (statInFrames || 0) / getCameraFPS() / 60
        );
        break;
      case "seconds":
        armPoseStatsInSecondsMap.set(key, (statInFrames || 0) / getCameraFPS());
        break;
      default:
        // Default use seconds
        armPoseStatsInSecondsMap.set(key, (statInFrames || 0) / getCameraFPS());
        break;
    }
  });

  const armPoseStatsInSeconds = new ArmPoseData(
    Object.fromEntries(armPoseStatsInSecondsMap)
  );

  return new Response(true, armPoseStatsInSeconds);
};

export const getArmPoseDataInSession = async (
  videoFrames: VideoFrame[],
  numSegments: number = 10
): Promise<Response<any[] | null>> => {
  // const defaultArmPoseStats = {
  //   avg: 0,
  //   max: Number.MIN_SAFE_INTEGER,
  //   min: Number.MAX_SAFE_INTEGER,
  // };

  const chunkedVideoFrames = chunkArrayIntoNumberOfGroups(
    videoFrames,
    numSegments
  );

  if (chunkedVideoFrames.length === 0) {
    return new Response(false, null, 500, "VideoFrames Empty");
  }

  const firstDateTime = chunkedVideoFrames[0][0].timestamp;

  const data = chunkedVideoFrames.map((videoFrameWindow) => {
    const initialDateTime = videoFrameWindow[0].timestamp;
    const finalDateTime =
      videoFrameWindow[videoFrameWindow.length - 1].timestamp;

    const timeDiff = initialDateTime.diff(firstDateTime, "minutes").toObject();
    return videoFrameWindow.reduce(
      (acc, videoFrame, i, { length }) => {
        const armPosesInFrame = countArmPosesInFrame(videoFrame);
        return {
          avgFrameNumber: acc.avgFrameNumber + videoFrame.frameNumber / length,
          timestamp: acc.timestamp,
          [ArmPose.ArmsCrossed]:
            acc[ArmPose.ArmsCrossed] +
            (armPosesInFrame[ArmPose.ArmsCrossed] || 0) / length,
          [ArmPose.Error]:
            acc[ArmPose.Error] + (armPosesInFrame[ArmPose.Error] || 0) / length,
          [ArmPose.HandsOnFace]:
            acc[ArmPose.HandsOnFace] +
            (armPosesInFrame[ArmPose.HandsOnFace] || 0) / length,
          [ArmPose.HandsRaised]:
            acc[ArmPose.HandsRaised] +
            (armPosesInFrame[ArmPose.HandsRaised] || 0) / length,
          [ArmPose.Other]:
            acc[ArmPose.Other] + (armPosesInFrame[ArmPose.Other] || 0) / length,
          timeDiff: acc.timeDiff,
        };
      },
      {
        avgFrameNumber: 0,
        timestamp: {
          begin: initialDateTime,
          end: finalDateTime,
        },
        [ArmPose.ArmsCrossed]: 0,
        [ArmPose.Error]: 0,
        [ArmPose.HandsOnFace]: 0,
        [ArmPose.HandsRaised]: 0,
        [ArmPose.Other]: 0,
        timeDiff: timeDiff,
      }
    );
  });

  return new Response(true, data);
};

export const countArmPosesFromFrames = (frames: VideoFrame[]) =>
  frames.map((frame) => {
    const countMap = frame.people.reduce(
      (frameCountMap: Map<ArmPose, number>, person: Person) => {
        frameCountMap.set(
          person.armpose,
          (frameCountMap.get(person.armpose) || 0) + 1
        );
        return frameCountMap;
      },
      new Map()
    );
    return { countMap: Object.fromEntries(countMap), ...frame };
  });

export const countArmPosesInFrame = (frame: VideoFrame) => {
  const countMap = frame.people.reduce(
    (frameCountMap: Map<ArmPose, number>, person: Person) => {
      frameCountMap.set(
        person.armpose,
        (frameCountMap.get(person.armpose) || 0) + 1
      );
      return frameCountMap;
    },
    new Map()
  );
  return Object.fromEntries(countMap);
};
