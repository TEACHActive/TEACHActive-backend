import { TestHelper } from "../util";
import { ArmPose } from "../sessions/types";
import { getAttendanceFromVideoFrames } from "./controller";

const sampleHelper = new TestHelper();

// prettier-ignore
const sampleVideoFramesAndStats = [{
  videoFrames: [
    sampleHelper.constructVideoFrame([ArmPose.Other, ArmPose.HandsRaised]),//2
    sampleHelper.constructVideoFrame([ArmPose.ArmsCrossed]),//1
    sampleHelper.constructVideoFrame([ArmPose.ArmsCrossed, ArmPose.HandsRaised, ArmPose.Other, ArmPose.Other, ArmPose.Other]),//5
    sampleHelper.constructVideoFrame([ArmPose.ArmsCrossed, ArmPose.HandsRaised]),//2
    sampleHelper.constructVideoFrame([ArmPose.ArmsCrossed, ArmPose.HandsOnFace]),//2
    sampleHelper.constructVideoFrame([ArmPose.HandsRaised]),//1
    sampleHelper.constructVideoFrame([]),//0
    sampleHelper.constructVideoFrame([ArmPose.HandsRaised, ArmPose.HandsOnFace]),//2
    sampleHelper.constructVideoFrame([ArmPose.Error]),//1
    sampleHelper.constructVideoFrame([ArmPose.Error, ArmPose.HandsOnFace]),//2
  ],
  stats: {
    minAttendence: 0,
    avgAttendence: 1.8,
    maxAttendence: 5
  },
}]
describe("getAttendanceFromVideoFrames", () => {
  it("Gets correct attendence from videoframes", () => {
    const sampleIndex = 0;
    const result = getAttendanceFromVideoFrames(
      sampleVideoFramesAndStats[sampleIndex].videoFrames
    );
    expect(result.data).toBeDefined();
    expect(result.data?.min).toBe(
      sampleVideoFramesAndStats[sampleIndex].stats.minAttendence
    );
    expect(result.data?.avg).toBeCloseTo(
      sampleVideoFramesAndStats[sampleIndex].stats.avgAttendence
    );
    expect(result.data?.max).toBe(
      sampleVideoFramesAndStats[sampleIndex].stats.maxAttendence
    );
  });
});
