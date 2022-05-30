import { Response } from "../types";
import { chunkArrayIntoUnits } from "../util";
import { Person, SitStand, VideoFrame } from "../sessions/types";

export const getSitStandTestInSession = async (
  videoFrames: VideoFrame[],
  numSegments: number
): Promise<Response<any | null>> => {
  const chunkedVideoFrames = chunkArrayIntoUnits(videoFrames, numSegments);
  if (chunkedVideoFrames.length === 0) {
    return new Response(false, null, 500, "VideoFrames Empty");
  }

  const firstDateTime = chunkedVideoFrames[0][0].timestamp;

  const data = chunkedVideoFrames.map((frameWindow) => {
    const initialDateTime = frameWindow[0].timestamp;
    const finalDateTime = frameWindow[frameWindow.length - 1].timestamp;
    const timeDiff = initialDateTime.diff(firstDateTime, "minutes").toObject();
    return frameWindow.reduce(
      (acc, videoFrame, _, { length }) => {
        const sitStandData = countSitStandInFrame(videoFrame);
        return {
          [SitStand.Sit]:
            acc[SitStand.Sit] + (sitStandData[SitStand.Sit] || 0) / length,
          [SitStand.Stand]:
            acc[SitStand.Stand] + (sitStandData[SitStand.Stand] || 0) / length,
          [SitStand.Error]:
            acc[SitStand.Error] + (sitStandData[SitStand.Error] || 0) / length,
          frameNumber: 0,
          timestamp: acc.timestamp,
          timeDiff: acc.timeDiff,
        };
      },
      {
        [SitStand.Sit]: 0,
        [SitStand.Stand]: 0,
        [SitStand.Error]: 0,
        frameNumber: 0,
        timestamp: {
          begin: initialDateTime,
          end: finalDateTime,
        },
        timeDiff: timeDiff,
      }
    );
  });

  return new Response(true, data);
};

export const getSitStandDataInSession = async (
  videoFrames: VideoFrame[],
  chunkSizeInMinutes: number
): Promise<Response<any | null>> => {
  const chunkedVideoFrames = chunkArrayIntoUnits(
    videoFrames,
    chunkSizeInMinutes
  );

  if (chunkedVideoFrames.length === 0) {
    return new Response(false, null, 500, "VideoFrames Empty");
  }

  const firstDateTime = chunkedVideoFrames[0][0].timestamp;

  const data = chunkedVideoFrames.map((frameWindow) => {
    const initialDateTime = frameWindow[0].timestamp;
    const finalDateTime = frameWindow[frameWindow.length - 1].timestamp;
    const timeDiff = initialDateTime.diff(firstDateTime, "minutes").toObject();
    return frameWindow.reduce(
      (acc, videoFrame, _, { length }) => {
        const sitStandData = countSitStandInFrame(videoFrame);
        return {
          [SitStand.Sit]:
            acc[SitStand.Sit] + (sitStandData[SitStand.Sit] || 0) / length,
          [SitStand.Stand]:
            acc[SitStand.Stand] + (sitStandData[SitStand.Stand] || 0) / length,
          [SitStand.Error]:
            acc[SitStand.Error] + (sitStandData[SitStand.Error] || 0) / length,
          frameNumber: 0,
          timestamp: acc.timestamp,
          timeDiff: acc.timeDiff,
        };
      },
      {
        [SitStand.Sit]: 0,
        [SitStand.Stand]: 0,
        [SitStand.Error]: 0,
        frameNumber: 0,
        timestamp: {
          begin: initialDateTime,
          end: finalDateTime,
        },
        timeDiff: timeDiff,
      }
    );
  });

  return new Response(true, data);
};

const countSitStandInFrame = (frame: VideoFrame) => {
  const countMap = frame.people.reduce(
    (frameCountMap: Map<SitStand, number>, person: Person) => {
      frameCountMap.set(
        person.sitStand,
        (frameCountMap.get(person.sitStand) || 0) + 1
      );
      return frameCountMap;
    },
    new Map()
  );
  return Object.fromEntries(countMap);
};
