import { DateTime } from "luxon";

import { TestHelper } from "../util";
import { getCameraFPS } from "../engine";
import { ArmPose, LimitedDurationUnit } from "../sessions/types";
import {
  getArmPoseDataInSession,
  getArmPoseTotalsInSession,
} from "./controller";

const sampleHelper = new TestHelper();
// prettier-ignore
const sampleVideoFramesAndStats = {
  videoFrames: [
    sampleHelper.constructVideoFrame([ArmPose.Other,ArmPose.HandsRaised,ArmPose.Other]),
    sampleHelper.constructVideoFrame([ArmPose.ArmsCrossed,ArmPose.HandsRaised,ArmPose.Other]),
    sampleHelper.constructVideoFrame([ArmPose.ArmsCrossed,ArmPose.HandsRaised,ArmPose.Other]),
    sampleHelper.constructVideoFrame([ArmPose.ArmsCrossed,ArmPose.HandsRaised,ArmPose.HandsOnFace]),
    sampleHelper.constructVideoFrame([ArmPose.ArmsCrossed,ArmPose.HandsOnFace,ArmPose.HandsOnFace]),
    sampleHelper.constructVideoFrame([ArmPose.HandsRaised,ArmPose.HandsOnFace,ArmPose.HandsRaised]),
    sampleHelper.constructVideoFrame([ArmPose.HandsRaised,ArmPose.HandsOnFace,ArmPose.HandsRaised]),
    sampleHelper.constructVideoFrame([ArmPose.HandsRaised,ArmPose.HandsOnFace,ArmPose.HandsRaised]),
    sampleHelper.constructVideoFrame([ArmPose.Error,ArmPose.HandsOnFace,ArmPose.HandsRaised]),
    sampleHelper.constructVideoFrame([ArmPose.Error,ArmPose.HandsOnFace,ArmPose.HandsRaised]),
  ],
  stats: {
    [ArmPose.HandsRaised]: { frames: 12, seconds: 12 / getCameraFPS() },
    [ArmPose.ArmsCrossed]: { frames: 4, seconds: 4 / getCameraFPS() },
    [ArmPose.HandsOnFace]: { frames: 8, seconds: 8 / getCameraFPS() },
    [ArmPose.Other]: { frames: 4, seconds: 4 / getCameraFPS() },
    [ArmPose.Error]: { frames: 2, seconds: 2 / getCameraFPS() },
  },
};

describe("getArmPoseTotalsInSession", () => {
  it("Calculates the correct number of arm poses in frames", () => {
    const result = getArmPoseTotalsInSession(
      sampleVideoFramesAndStats.videoFrames,
      LimitedDurationUnit.Frames
    );

    expect(result.data).toBeDefined();
    expect(result.data?.handsRaised).toBe(
      sampleVideoFramesAndStats.stats[ArmPose.HandsRaised].frames
    );
  });
  it("Calculates the correct number of arm poses in seconds", () => {
    const result = getArmPoseTotalsInSession(
      sampleVideoFramesAndStats.videoFrames,
      LimitedDurationUnit.Seconds
    );

    expect(result.data).toBeDefined();
    expect(result.data?.handsRaised).toBeCloseTo(
      sampleVideoFramesAndStats.stats[ArmPose.HandsRaised].seconds
    );
  });
});

describe("getArmPoseDataInSession", () => {
  it("Returns correct number of segments of data windows", () => {
    const numSegments = 10;
    const result = getArmPoseDataInSession(
      sampleVideoFramesAndStats.videoFrames,
      numSegments
    );
    expect(result.data).toBeDefined();
    expect(result.data?.length).toBe(numSegments);
  });
});
