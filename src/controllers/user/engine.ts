import express from "express";
import { DateTime, Interval } from "luxon";
import { Document } from "mongoose";
import { UserModel } from "../../models/userModel";
import { User } from "./types";

export const GetUser = async (id: string): Promise<Document<User> | null> => {
  if (id === undefined) {
    throw new Error(`Can not get user with id: ${id}`);
  }
  const matchingUser = await UserModel.findById(id);

  return matchingUser;
};
