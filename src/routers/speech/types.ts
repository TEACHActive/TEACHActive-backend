import { DateTime, DurationObject } from "luxon";
import { getCameraFPS } from "../engine";
import { Channel, Speaker } from "../sessions/types";

export interface SpeechFrame {
  channel: Channel;
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
  timeDiff: DurationObject;
  timestamp: DateTime;
  speaker: Speaker;
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
  timeDiff: DurationObject;
  speakerInSeconds: SpeakerDataInSecondsFromFrames;
}

export class SpeechTotalsInSecondsFromFrames {
  [Speaker.Ambient]: number;
  [Speaker.Instructor]: number;
  [Speaker.Student]: number;

  constructor(data: any) {
    this[Speaker.Ambient] = data[Speaker.Ambient] / getCameraFPS();
    this[Speaker.Instructor] = data[Speaker.Instructor] / getCameraFPS();
    this[Speaker.Student] = data[Speaker.Student] / getCameraFPS();
  }
}

export class SpeakerDataInSecondsFromFrames {
  [Speaker.Ambient]: number;
  [Speaker.Student]: number;
  [Speaker.Instructor]: number;

  constructor(data: any) {
    this[Speaker.Ambient] = data[Speaker.Ambient] / getCameraFPS();
    this[Speaker.Student] = data[Speaker.Student] / getCameraFPS();
    this[Speaker.Instructor] = data[Speaker.Instructor] / getCameraFPS();
  }
}
