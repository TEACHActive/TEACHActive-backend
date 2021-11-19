import { Response } from "../types";
import { chunkArrayIntoNumberOfGroups } from "../util";
import { ArmPoseData, ArmPoseStats } from "./types";
import { getCameraFPS, getVideoFramesBySessionId } from "../engine";
import { ArmPose, Channel, Person, VideoFrame } from "../sessions/types";
import { DateTime } from "luxon";

export const getArmPoseTotalsInSecondsInSession = async (
  sessionId: string
): Promise<Response<ArmPoseData | null>> => {
  const videoFrames = await getVideoFramesBySessionId(
    sessionId,
    Channel.Student
  );

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
    armPoseStatsInSecondsMap.set(key, (statInFrames || 0) / getCameraFPS());
  });

  const armPoseStatsInSeconds = new ArmPoseData(
    Object.fromEntries(armPoseStatsInSecondsMap)
  );

  return new Response(true, armPoseStatsInSeconds);
};

export const getArmPoseDataInSession = async (
  sessionId: string,
  numSegments: number = 10
): Promise<Response<any[] | null>> => {
  const videoFrames = await getVideoFramesBySessionId(
    sessionId,
    Channel.Student
  );

  const defaultArmPoseStats = {
    avg: 0,
    max: Number.MIN_SAFE_INTEGER,
    min: Number.MAX_SAFE_INTEGER,
  };

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

// export const getArmPoseDataInSession = async (
//   sessionId: string,
//   numSegments: number = 10
// ): Promise<Response<ArmPoseStats[] | null>> => {
//   const videoFrames = await getVideoFramesBySessionId(
//     sessionId,
//     Channel.Student
//   );

//   const defaultArmPoseStats = {
//     avg: 0,
//     max: Number.MIN_SAFE_INTEGER,
//     min: Number.MAX_SAFE_INTEGER,
//   };
//   const chunkedArmPoses = chunkArrayIntoNumberOfGroups(
//     countArmPosesFromFrames(videoFrames),
//     numSegments
//   );

//   const armPoseDataStats = chunkedArmPoses.map((armPoseArrayDataWindow, i) => {
//     const stats = armPoseArrayDataWindow.reduce(
//       (map: Map<string, ArmPoseStats>, armPoseData, _, { length }) => {
//         Object.keys(armPoseData.countMap).forEach((armPoseKey) => {
//           let statsForArmPose =
//             { ...map.get(armPoseKey) } || defaultArmPoseStats;
//           statsForArmPose.max = Math.max(
//             armPoseData.countMap[armPoseKey],
//             statsForArmPose.max || defaultArmPoseStats.max
//           );
//           statsForArmPose.min = Math.min(
//             armPoseData.countMap[armPoseKey],
//             statsForArmPose.min || defaultArmPoseStats.min
//           );
//           statsForArmPose.avg =
//             (statsForArmPose.avg || defaultArmPoseStats.avg) +
//             armPoseData.countMap[armPoseKey] / length;
//           map.set(armPoseKey, statsForArmPose);
//         });
//         return map;
//       },
//       new Map()
//     );
//     return Object.fromEntries(stats);
//   });

//   return new Response(true, armPoseDataStats);
// };

const countArmPosesFromFrames = (frames: VideoFrame[]) =>
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

const countArmPosesInFrame = (frame: VideoFrame) => {
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
