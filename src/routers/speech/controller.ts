import { DateTime, Duration, DurationUnit } from "luxon";
import { getAudioFramesBySessionId } from "../engine";
import { AudioFrame, Channel, Speaker } from "../sessions/types";
import { Response } from "../types";
import { chunkArray } from "../util";
import {
  SpeakerDataInSecondsFromFrames,
  SpeechCombinedDataFrame,
  SpeechDataCombined,
  SpeechFrame,
  SpeechTotalsInSecondsFromFrames,
} from "./types";

export const getSpeechDataSession = async (
  sessionId: string,
  channel: Channel,
  numSegments: number = 100,
  durationUnit: DurationUnit = "minutes"
): Promise<Response<SpeechFrame[] | null>> => {
  const audioFrames = await getAudioFramesBySessionId(sessionId, channel);

  if (audioFrames.length === 0) {
    return new Response(false, null, 404, `No ${channel} audio frames`);
  }

  const initialDateTime = audioFrames[0].timestamp;

  const audioFramesWithTimeDiff = audioFrames.map((frame) => {
    const timeDiff = frame.timestamp.diff(initialDateTime, durationUnit);
    return {
      ...frame,
      timeDiff: timeDiff.toObject(),
    };
  });

  const currDate = DateTime.fromJSDate(new Date());

  const defaultSpeechStats = {
    timestamp: {
      begin: currDate.plus({ years: 100 }),
      end: currDate.minus({ years: 100 }),
    },
    frameNumber: {
      begin: Number.MAX_SAFE_INTEGER,
      avg: 0,
      end: Number.MIN_SAFE_INTEGER,
    },
    amplitude: {
      min: 1,
      max: 0,
      avg: 0,
    },
    channel: channel,
    timeDiff: Duration.fromMillis(0).toObject(),
  };

  const chunkedSpeechFrames = chunkArray(audioFramesWithTimeDiff, numSegments);

  const speechData = chunkedSpeechFrames.map((frameWindow) =>
    frameWindow.reduce((acc, frame, _, { length }) => {
      return {
        timestamp: {
          begin: DateTime.min(frame.timestamp, acc.timestamp.begin),
          end: DateTime.max(frame.timestamp, acc.timestamp.end),
        },
        frameNumber: {
          begin: Math.min(frame.frameNumber, acc.frameNumber.begin),
          avg: acc.frameNumber.avg + frame.frameNumber / length,
          end: Math.max(frame.frameNumber, acc.frameNumber.end),
        },
        amplitude: {
          min: Math.min(frame.amplitude, acc.amplitude.min),
          avg: acc.amplitude.avg + frame.amplitude / length,
          max: Math.max(frame.amplitude, acc.amplitude.max),
        },
        timeDiff: frame.timeDiff,
        channel: channel,
      };
    }, defaultSpeechStats)
  );

  return new Response(true, speechData);
};

export const getSpeechDataCombinedInSession = async (
  sessionId: string,
  numSegments: number = 100,
  minSpeakingAmp: number = 0.005
): Promise<Response<SpeechDataCombined[] | null>> => {
  const speechDataCombined = await calculateSpeechDataCombinedInSession(
    sessionId,
    minSpeakingAmp
  );

  const currDate = DateTime.fromJSDate(new Date());

  const defaultSpeechFrameStats = {
    timestamp: {
      begin: currDate.plus({ years: 100 }),
      end: currDate.minus({ years: 100 }),
    },
    frameNumber: {
      begin: Number.MAX_SAFE_INTEGER,
      avg: 0,
      end: Number.MIN_SAFE_INTEGER,
    },
    speakerMap: new Map<Speaker, number>(),
    speakerInSeconds: new SpeakerDataInSecondsFromFrames({}),
    timeDiff: Duration.fromMillis(0).toObject(),
  };

  const chunkedSpeechFrames = chunkArray(speechDataCombined, numSegments);

  const speechFramesData = chunkedSpeechFrames.map((frameWindow) => {
    const speechStats = frameWindow.reduce((acc, frame, _, { length }) => {
      acc.speakerMap.set(
        frame.speaker,
        (acc.speakerMap.get(frame.speaker) || 0) + 1
      );
      return {
        timestamp: {
          begin: DateTime.min(frame.timestamp, acc.timestamp.begin),
          end: DateTime.max(frame.timestamp, acc.timestamp.end),
        },
        timeDiff: frame.timeDiff,
        frameNumber: {
          begin: Math.min(frame.frameNumber, acc.frameNumber.begin),
          avg: acc.frameNumber.avg + frame.frameNumber / length,
          end: Math.max(frame.frameNumber, acc.frameNumber.end),
        },
        speakerMap: acc.speakerMap,
        speakerInSeconds: acc.speakerInSeconds,
      };
    }, defaultSpeechFrameStats);
    speechStats.speakerInSeconds = new SpeakerDataInSecondsFromFrames(
      Object.fromEntries(speechStats.speakerMap)
    );

    return speechStats;
  });

  return new Response(true, speechFramesData);
};

export const getSpeechTotalsInSecondsInSession = async (
  sessionId: string,
  minSpeakingAmp: number = 0.005
): Promise<Response<SpeechTotalsInSecondsFromFrames | null>> => {
  const speechDataCombined = await calculateSpeechDataCombinedInSession(
    sessionId,
    minSpeakingAmp
  );

  const speechTotals = new SpeechTotalsInSecondsFromFrames(
    countSpeechTotalsForFrames(speechDataCombined)
  );

  return new Response(true, speechTotals);
};

const countSpeechTotalsForFrames = (frames: SpeechCombinedDataFrame[]) => {
  const speechTotalsMap = new Map<Speaker, number>();

  frames.forEach((frame) => {
    speechTotalsMap.set(
      frame.speaker,
      (speechTotalsMap.get(frame.speaker) || 0) + 1
    );
  });

  return Object.fromEntries(speechTotalsMap);
};

const calculateSpeechDataCombinedInSession = async (
  sessionId: string,
  minSpeakingAmp: number = 0.005
): Promise<SpeechCombinedDataFrame[]> => {
  let studentAudioFrames, instructorAudioFrames, response;
  instructorAudioFrames = await getAudioFramesBySessionId(
    sessionId,
    Channel.Instructor
  );
  studentAudioFrames = await getAudioFramesBySessionId(
    sessionId,
    Channel.Student
  );

  if (
    instructorAudioFrames &&
    instructorAudioFrames.length > 0 &&
    studentAudioFrames &&
    studentAudioFrames.length > 0
  ) {
    const instructorInitialDateTime = instructorAudioFrames[0].timestamp;
    const studentInitialDateTime = studentAudioFrames[0].timestamp;
    instructorAudioFrames = instructorAudioFrames.map((frame: AudioFrame) => {
      let timeDiff = frame.timestamp
        .diff(instructorInitialDateTime, "seconds")
        .toObject();
      timeDiff["seconds"] = Math.round(timeDiff["seconds"] || 0);

      return {
        ...frame,
        timeDiff: timeDiff,
      };
    });

    studentAudioFrames = studentAudioFrames.map((frame: AudioFrame) => {
      let timeDiff = frame.timestamp
        .diff(studentInitialDateTime, "seconds")
        .toObject();
      timeDiff["seconds"] = Math.round(timeDiff["seconds"] || 0);

      return {
        ...frame,
        timeDiff: timeDiff,
      };
    });

    let speakerData = [];
    for (
      let i = 0;
      i < Math.min(instructorAudioFrames.length, studentAudioFrames.length);
      i++
    ) {
      const insAmp = instructorAudioFrames[i].amplitude;
      const stuAmp = studentAudioFrames[i].amplitude;
      let timeDiff = instructorAudioFrames[i].timestamp
        .diff(instructorInitialDateTime, "seconds")
        .toObject();
      timeDiff["seconds"] = Math.round(timeDiff["seconds"] || 0);

      let speaker;
      if (insAmp < minSpeakingAmp && stuAmp < minSpeakingAmp) {
        speaker = Speaker.Ambient;
      } else {
        speaker = insAmp > stuAmp ? Speaker.Instructor : Speaker.Student;
      }

      speakerData.push({
        frameNumber: instructorAudioFrames[i].frameNumber,
        speaker: speaker,
        timeDiff: timeDiff,
        timestamp: instructorAudioFrames[i].timestamp,
      });
    }
    speakerData.sort((a, b) => a.timestamp.toMillis() - b.timestamp.toMillis());
    return speakerData;
  } else {
    throw new Error("Either Instructor or Student frames null or empty");
  }
};
