import express from "express";
import { DateTime, Interval } from "luxon";
import { Document } from "mongoose";
import { ReflectionsModel } from "../../models/reflectionsModel";

export const GetUserSessionReflections = async (
  uid: string,
  sessionId: string
): Promise<Document<any> | null> => {
  if (uid === undefined) {
    throw new Error(`Can not get reflections with uid: ${uid}`);
  }
  if (sessionId === undefined) {
    throw new Error(`Can not get reflections with sessionId: ${sessionId}`);
  }

  const matchingReflections = await ReflectionsModel.findOne({
    userId: uid,
    sessionId: sessionId,
  });

  return matchingReflections;
};
