import { ArmPose } from "./sessions/types";
import { chunkArrayIntoMinutes, TestHelper } from "./util";

const sampleHelper = new TestHelper();

let currNumSeconds = 0;

// prettier-ignore
const videoFrames = [
    sampleHelper.constructVideoFrame([ArmPose.Other,ArmPose.HandsRaised,ArmPose.Other], currNumSeconds),
    sampleHelper.constructVideoFrame([ArmPose.Other,ArmPose.HandsRaised,ArmPose.Other], currNumSeconds += 20),
    sampleHelper.constructVideoFrame([ArmPose.ArmsCrossed,ArmPose.HandsRaised,ArmPose.Other], currNumSeconds += 20),
    sampleHelper.constructVideoFrame([ArmPose.ArmsCrossed,ArmPose.HandsRaised,ArmPose.Other], currNumSeconds += 20),
    sampleHelper.constructVideoFrame([ArmPose.ArmsCrossed,ArmPose.HandsRaised,ArmPose.HandsOnFace], currNumSeconds += 20),
    sampleHelper.constructVideoFrame([ArmPose.ArmsCrossed,ArmPose.HandsOnFace,ArmPose.HandsOnFace], currNumSeconds += 20),
    sampleHelper.constructVideoFrame([ArmPose.HandsRaised,ArmPose.HandsOnFace,ArmPose.HandsRaised], currNumSeconds += 20),
    sampleHelper.constructVideoFrame([ArmPose.HandsRaised,ArmPose.HandsOnFace,ArmPose.HandsRaised], currNumSeconds += 20),
    sampleHelper.constructVideoFrame([ArmPose.HandsRaised,ArmPose.HandsOnFace,ArmPose.HandsRaised], currNumSeconds += 20),
    sampleHelper.constructVideoFrame([ArmPose.Error,ArmPose.HandsOnFace,ArmPose.HandsRaised], currNumSeconds += 20),
    sampleHelper.constructVideoFrame([ArmPose.Error,ArmPose.HandsOnFace,ArmPose.HandsRaised], currNumSeconds += 20),
];
describe("chunkArrayIntoMinutes", () => {
  it("Correctly chunks array by minute", () => {
    const result = chunkArrayIntoMinutes(videoFrames);

    // console.log(result.map((a) => a.map((b) => b.timestamp.toISOTime())));

    expect(result).toBeDefined();
    expect(result[0].length).toBe(3);
    expect(result[1].length).toBe(3);
    expect(result[2].length).toBe(3);
    expect(result[3].length).toBe(2);
  });
  it("Correctly chunks array with different chunk size", () => {
    const result = chunkArrayIntoMinutes(videoFrames, 2);

    console.log(result.map((a) => a.map((b) => b.timestamp.toISOTime())));

    expect(result).toBeDefined();
    expect(result[0].length).toBe(6);
    expect(result[1].length).toBe(5);
  });
});
