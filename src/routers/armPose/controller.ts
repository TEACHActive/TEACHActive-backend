import { Response } from "../types";
import { chunkArray } from "../util";
import { ArmPoseData, ArmPoseStats } from "./types";
import { getCameraFPS, getVideoFramesBySessionId } from "../engine";
import { ArmPose, Channel, Person, VideoFrame } from "../sessions/types";

export const getArmPoseTotalsInSecondsInSession = async (
  sessionId: string
): Promise<Response<ArmPoseData | null>> => {
  const videoFrames = await getVideoFramesBySessionId(
    sessionId,
    Channel.Student
  );

  const armPoseMap = countArmPosesForFrames(videoFrames).reduce(
    (map: Map<string, number>, frameCountMap) => {
      Object.keys(frameCountMap).map((key) => {
        map.set(key, (map.get(key) || 0) + frameCountMap[key]);
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
  numSegments: number = 100
): Promise<Response<ArmPoseStats[] | null>> => {
  const videoFrames = await getVideoFramesBySessionId(
    sessionId,
    Channel.Student
  );

  const defaultArmPoseStats = {
    avg: 0,
    max: Number.MIN_VALUE,
    min: Number.MAX_VALUE,
  };
  const chunkedArmPoses = chunkArray(
    countArmPosesForFrames(videoFrames),
    numSegments
  );

  const armPoseDataStats = chunkedArmPoses.map((armPoseArrayDataWindow, i) => {
    const stats = armPoseArrayDataWindow.reduce(
      (map: Map<string, ArmPoseStats>, armPoseData, _, { length }) => {
        Object.keys(armPoseData).forEach((armPoseKey) => {
          let statsForArmPose =
            { ...map.get(armPoseKey) } || defaultArmPoseStats;
          statsForArmPose.max = Math.max(
            armPoseData[armPoseKey],
            statsForArmPose.max || defaultArmPoseStats.max
          );
          statsForArmPose.min = Math.min(
            armPoseData[armPoseKey],
            statsForArmPose.min || defaultArmPoseStats.min
          );
          statsForArmPose.avg =
            (statsForArmPose.avg || defaultArmPoseStats.avg) +
            armPoseData[armPoseKey] / length;
          map.set(armPoseKey, statsForArmPose);
        });
        return map;
      },
      new Map()
    );
    return Object.fromEntries(stats);
  });

  return new Response(true, armPoseDataStats);
};

const countArmPosesForFrames = (frames: VideoFrame[]) =>
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
    return Object.fromEntries(countMap);
  });
