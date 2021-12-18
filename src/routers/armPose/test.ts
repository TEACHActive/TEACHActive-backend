import { DateTime } from "luxon";
import { ArmPose, Body, Person, SitStand, VideoFrame } from "../sessions/types";
import { getArmPoseTotalsInSession } from "./controller";

class TestHelper {
  frameNumber: number;
  startDateTime: DateTime;
  currDateTime: DateTime;

  constructor(
    initialFrameNumber: number = 0,
    startDateTime: DateTime = DateTime.fromISO("2021-12-08")
  ) {
    this.frameNumber = initialFrameNumber;
    this.startDateTime = startDateTime;
    this.currDateTime = startDateTime;
  }

  constructVideoFrame = (
    secondsDiff: number = 1,
    frameNumberDiff: number = 1
  ): VideoFrame => {
    return {
      frameNumber: (this.frameNumber += frameNumberDiff),
      timestamp: this.currDateTime.plus({ seconds: secondsDiff }),
      people: [
        new Person({
          openposeId: 0,
          trackingId: 1,
          armpose: ArmPose.HandsRaised,
          body: new Body([]), //TODO: Add number array to body
          sitStand: SitStand.Sit,
        }),
      ],
      serialize: () => null,
    };
  };
}

describe("getArmPoseTotalsInSession", () => {
  it("Calculates the correct number of arm poses in seconds", () => {
    const helper = new TestHelper();
    const videoFrames = [
      helper.constructVideoFrame(),
      helper.constructVideoFrame(),
      helper.constructVideoFrame(),
    ];

    const result = getArmPoseTotalsInSession(videoFrames, "seconds");

    expect(result.data).toBeDefined();

    // [ArmPose.ArmsCrossed]: number;
    // [ArmPose.Error]: number;
    // [ArmPose.HandsOnFace]: number;
    // [ArmPose.HandsRaised]: number;
    // [ArmPose.Other]: number;
  });
});

describe("getArmPoseDataInSession", () => {
  it("", () => {}); // TODO: Impliment Test
});

describe("countArmPosesFromFrames", () => {
  it("", () => {}); // TODO: Impliment Test
});

describe("countArmPosesInFrame", () => {
  it("", () => {}); // TODO: Impliment Test
});
