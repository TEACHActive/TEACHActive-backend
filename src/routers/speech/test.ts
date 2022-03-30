import { DateTime, DurationUnit } from "luxon";

import { AudioChannel, AudioFrame, Speaker } from "../sessions/types";
import { SpeechCombinedDataFrame } from "./types";
import {
  getSpeechDataInSession,
  getSpeechTotalsInSecondsInSession,
} from "./controller";
import { getCameraFPS } from "../engine";

class SpeechTestHelper {
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

  constructCombinedSpeechDataFrame = (
    speaker: Speaker,
    secondsDiff: number = 1,
    frameNumberDiff: number = 1
  ): SpeechCombinedDataFrame => {
    return {
      frameNumber: (this.frameNumber += frameNumberDiff),
      timestamp: this.currDateTime.plus({ seconds: secondsDiff }),
      speaker: speaker,
      timeDiff: this.currDateTime
        .plus({ seconds: secondsDiff })
        .diff(this.startDateTime)
        .toObject(),
    };
  };

  constructAudioFrame = (
    amplitude: number = Math.random(),
    secondsDiff: number = 1,
    frameNumberDiff: number = 1
  ): AudioFrame => {
    return new AudioFrame(
      {
        frameNumber: (this.frameNumber += frameNumberDiff),
        timestamp: this.currDateTime.plus({ seconds: secondsDiff }),
        audio: {
          amplitude: amplitude,
        },
      },
      this.startDateTime,
      getCameraFPS()
    );
  };
}

const defaultHelper1 = new SpeechTestHelper();
const defaultHelper2 = new SpeechTestHelper();
const defaultStudentAudioFrames: AudioFrame[] = [
  defaultHelper1.constructAudioFrame(1),
  defaultHelper1.constructAudioFrame(0),
  defaultHelper1.constructAudioFrame(1),
];
const defaultInstructorAudioFrames: AudioFrame[] = [
  defaultHelper2.constructAudioFrame(0),
  defaultHelper2.constructAudioFrame(1),
  defaultHelper2.constructAudioFrame(0),
];

describe("getSpeechDataInSession", () => {
  it("Returns false success when audioFrames empty array", () => {
    //Setup
    const audioFrames: AudioFrame[] = [];
    const channel: AudioChannel = AudioChannel.Instructor;
    const numSegments: number = 10;
    const durationUnit: DurationUnit = "minutes";

    //Eval
    const result = getSpeechDataInSession(
      audioFrames,
      channel,
      numSegments,
      durationUnit
    );

    //Test
    expect(result.success).toBe(false);
  });
});
describe("getSpeechDataCombinedInSession", () => {
  it("", () => {}); // TODO: Impliment Test
});
describe("getSpeechTotalsInSecondsInSession", () => {
  it("Returns correct ambiant time", () => {
    const helper1 = new SpeechTestHelper();
    const helper2 = new SpeechTestHelper();
    const studentAudioFrames: AudioFrame[] = [
      helper1.constructAudioFrame(0.001),
      helper1.constructAudioFrame(0.002),
      helper1.constructAudioFrame(0.003),
      helper1.constructAudioFrame(0.004),
      helper1.constructAudioFrame(0.1),
      helper1.constructAudioFrame(0.2),
      helper2.constructAudioFrame(0.001),
      helper2.constructAudioFrame(0.001),
      helper2.constructAudioFrame(0.001),
    ];
    const instructorAudioFrames: AudioFrame[] = [
      helper2.constructAudioFrame(0.2),
      helper2.constructAudioFrame(0.1),
      helper2.constructAudioFrame(0.004),
      helper2.constructAudioFrame(0.003),
      helper2.constructAudioFrame(0.002),
      helper2.constructAudioFrame(0.001),
      helper2.constructAudioFrame(0.001),
      helper2.constructAudioFrame(0.001),
    ];
    const minSpeakingAmp: number = 0.05;
    const result = getSpeechTotalsInSecondsInSession(
      studentAudioFrames,
      instructorAudioFrames,
      minSpeakingAmp
    );

    expect(result.data?.ambient).toBeCloseTo(4 / getCameraFPS());
  });
  it("Returns no ambiant time when minSpeakingAmp set to 0", () => {
    const minSpeakingAmp: number = 0;
    const result = getSpeechTotalsInSecondsInSession(
      defaultStudentAudioFrames,
      defaultInstructorAudioFrames,
      minSpeakingAmp
    );

    expect(result.data?.ambient).toBe(0);
  });
  it("Returns all ambiant time when minSpeakingAmp set to 1", () => {
    const minSpeakingAmp: number = 1;
    const result = getSpeechTotalsInSecondsInSession(
      defaultStudentAudioFrames,
      defaultInstructorAudioFrames,
      minSpeakingAmp
    );

    expect(result.data?.ambient).toBe(0);
  });
  it("Works inversely when instructor and student inputs are reversed", () => {
    const minSpeakingAmp: number = 0.05;

    const result1 = getSpeechTotalsInSecondsInSession(
      defaultStudentAudioFrames,
      defaultInstructorAudioFrames,
      minSpeakingAmp
    );
    const result2 = getSpeechTotalsInSecondsInSession(
      defaultInstructorAudioFrames,
      defaultStudentAudioFrames,
      minSpeakingAmp
    );

    expect(result1.data?.ambient).toEqual(result2.data?.ambient);
    expect(result1.data?.student).toEqual(result2.data?.instructor);
    expect(result1.data?.instructor).toEqual(result2.data?.student);
  });
  it("Gives no student | instructor speech when minSpeakingAmp > 1", () => {
    const minSpeakingAmp: number = 1.1;

    const result = getSpeechTotalsInSecondsInSession(
      defaultStudentAudioFrames,
      defaultInstructorAudioFrames,
      minSpeakingAmp
    );

    expect(result.data?.student).toBe(0);
    expect(result.data?.instructor).toBe(0);
  });
  it('Gives no ambiant "speech" when minSpeakingAmp == 0', () => {
    const minSpeakingAmp: number = 0;

    const result = getSpeechTotalsInSecondsInSession(
      defaultStudentAudioFrames,
      defaultInstructorAudioFrames,
      minSpeakingAmp
    );

    expect(result.data?.ambient).toBe(0);
  });
});
