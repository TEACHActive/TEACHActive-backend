import { DateTime, DurationObject } from "luxon";
import { getCameraFPS } from "../engine";
import { AudioChannel, Speaker } from "../sessions/types";

export interface SpeechFrame {
  channel: AudioChannel;
  timestamp: {
    begin: DateTime;
    end: DateTime;
  };
  frameNumber: {
    begin: number;
    avg: number;
    end: number;
  };
  timeDiff: DurationObject;
  amplitude: {
    min: number;
    max: number;
    avg: number;
  };
}

export interface SpeechCombinedDataFrame {
  frameNumber: number;
  timestamp: DateTime;
  speaker: Speaker;
  timeDiff: DurationObject;
}

export interface SpeechDataCombined {
  timestamp: {
    begin: DateTime;
    end: DateTime;
  };
  frameNumber: {
    begin: number;
    avg: number;
    end: number;
  };
  // timeDiff: DurationObject;
  speakerInSeconds: SpeakerDataInSecondsFromFrames;
}

export class SpeechTotalsInSecondsFromFrames {
  [Speaker.Ambient]: number;
  [Speaker.Silent]: number;
  [Speaker.Instructor]: number;
  [Speaker.Student]: number;

  constructor(data: any) {
    this[Speaker.Ambient] = data[Speaker.Ambient] / getCameraFPS();
    this[Speaker.Silent] = data[Speaker.Silent] / getCameraFPS();
    //Flip since student Video is student Instructor and vice versa
    this[Speaker.Instructor] = data[Speaker.Student] / getCameraFPS();
    this[Speaker.Student] = data[Speaker.Instructor] / getCameraFPS();
  }
}

export class SpeakerDataInSecondsFromFrames {
  [Speaker.Ambient]: number;
  [Speaker.Silent]: number;
  [Speaker.Student]: number;
  [Speaker.Instructor]: number;

  constructor(data: any) {
    this[Speaker.Ambient] = data[Speaker.Ambient] / getCameraFPS();
    this[Speaker.Silent] = data[Speaker.Silent] / getCameraFPS();
    //Flip since student Video is student Instructor and vice versa
    this[Speaker.Student] = data[Speaker.Instructor] / getCameraFPS();
    this[Speaker.Instructor] = data[Speaker.Student] / getCameraFPS();
  }
}
