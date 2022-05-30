import { DateTime } from "luxon";
import { IWithTimeDiff, IWithTimestamp, MethodType } from "./types";
import {
  ArmPose,
  Body,
  LimitedDurationUnit,
  Person,
  SitStand,
  VideoFrame,
} from "./sessions/types";
import { idText } from "typescript";

const BASE_URL_HTTPS = "https://teachactive.engineering.iastate.edu";
const EDUSENSE_STORAGE_URL = BASE_URL_HTTPS + ":5000";
const EDUSENSE_STORAGE_URL_DEV = BASE_URL_HTTPS + ":5001";

export const getAxiosConfig = (
  method: MethodType,
  endpoint: string,
  data?: any,
  auth?: {
    username: string;
    password: string;
  }
) => {
  const env = process.env.NODE_ENV || "development";

  const URL =
    env === "production" ? EDUSENSE_STORAGE_URL : EDUSENSE_STORAGE_URL_DEV;

  return {
    method: method,
    url: `${URL}${endpoint}`,
    data: data,
    auth: auth,
  };
};

/**
 * From: https://ourcodeworld.com/articles/read/278/how-to-split-an-array-into-chunks-of-the-same-size-easily-in-javascript
 * Returns an array with chunkSize number of arrays in it.
 *
 * @param myArray {Array} Array to split
 * @param chunkSize {Integer} Number of groups to chunk into, if falsy (0, null, etc) will return one chunk of all data
 */
export function chunkArrayIntoNumberOfGroups<T>(
  myArray: T[],
  chunkSize?: number
): T[][] {
  if (!chunkSize) chunkSize = myArray.length;
  const numItems = myArray.length / chunkSize;
  let results = [];

  while (myArray.length) {
    results.push(myArray.splice(0, numItems));
  }

  return results;
}

/**
 * From: https://ourcodeworld.com/articles/read/278/how-to-split-an-array-into-chunks-of-the-same-size-easily-in-javascript
 * Returns an array with arrays of the chunkSize size.
 *
 * @param myArray {Array} Array to split
 * @param chunkSize {Integer} Size of every group
 */
export function chunkArrayIntoGroupsOfSize<T>(
  myArray: T[],
  chunkSize: number
): T[][] {
  let results = [];

  while (myArray.length) {
    results.push(myArray.splice(0, chunkSize));
  }

  return results;
}

/**
 * Returns an array with arrays split by timestamp minute
 *
 * @param myArray {Array} Array to split
 */
export function chunkArrayIntoUnits<T extends IWithTimestamp>(
  myArray: T[],
  chunkSizeUnit: number = 1,
  unit: "seconds" | "minutes" = LimitedDurationUnit.Minutes
): T[][] {
  let results: T[][] = [];

  const firstDateTime = myArray[0].timestamp;

  for (let i = 0; i < myArray.length; i++) {
    const timeDiffMins = Math.floor(
      myArray[i].timestamp.diff(firstDateTime, unit)[unit] / chunkSizeUnit
    );

    if (!Array.isArray(results[timeDiffMins])) {
      results[timeDiffMins] = [];
    }
    results[timeDiffMins].push(myArray[i]);
  }

  return results;
}

export class TestHelper {
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
    armPoses: ArmPose[],
    secondsDiff: number = 1,
    frameNumberDiff: number = 1
  ): VideoFrame => {
    let openposeId = 0,
      trackingId = 0;

    return {
      frameNumber: (this.frameNumber += frameNumberDiff),
      timestamp: this.currDateTime.plus({ seconds: secondsDiff }),
      people: armPoses.map((armPose) => {
        const person = new Person({
          openposeId: openposeId++,
          inference: {
            trackingId: trackingId++,
            posture: {
              armPose: armPose,
            },
          },
          body: new Body([]), //TODO: Add number array to body
        });
        person.sitStand = SitStand.Sit; //Do this for now until body is corrected
        return person;
      }),
      serialize: () => null,
    };
  };
}
