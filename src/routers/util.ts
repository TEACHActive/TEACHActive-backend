import { MethodType } from "./types";
import * as Const from "../variables";

const BASE_URL_HTTPS = "https://teachactive.engineering.iastate.edu";
const EDUSENSE_STORAGE_URL = BASE_URL_HTTPS + ":5000";
const EDUSENSE_STORAGE_URL_DEV = BASE_URL_HTTPS + ":5001";

export const getAxiosConfig = (
  method: MethodType,
  endpoint: string,
  data?: any
) => {
  const env = process.env.NODE_ENV || "development";

  const URL =
    env === "production" ? EDUSENSE_STORAGE_URL : EDUSENSE_STORAGE_URL_DEV;

  return {
    method: method,
    url: `${URL}${endpoint}`,
    data: data,
    auth: {
      username: Const.DB_USER || "",
      password: Const.DB_PASS || "",
    },
  };
};

/**
 * From: https://ourcodeworld.com/articles/read/278/how-to-split-an-array-into-chunks-of-the-same-size-easily-in-javascript
 * Returns an array with arrays of the given size.
 *
 * @param myArray {Array} Array to split
 * @param chunkSize {Integer} Number of groups to chunk into, if falsy (0, null, etc) will return one chunk of all data
 */
export function chunkArrayIntoNumberOfGroups<T>(
  myArray: T[],
  chunk_size?: number
) {
  if (!chunk_size) chunk_size = myArray.length;
  const numItems = myArray.length / chunk_size;
  var results = [];

  while (myArray.length) {
    results.push(myArray.splice(0, numItems));
  }

  return results;
}

/**
 * From: https://ourcodeworld.com/articles/read/278/how-to-split-an-array-into-chunks-of-the-same-size-easily-in-javascript
 * Returns an array with arrays of the given size.
 *
 * @param myArray {Array} Array to split
 * @param chunkSize {Integer} Size of every group
 */
export function chunkArrayIntoGroupsOfSize<T>(
  myArray: T[],
  chunk_size: number
) {
  var results = [];

  while (myArray.length) {
    results.push(myArray.splice(0, chunk_size));
  }

  return results;
}
