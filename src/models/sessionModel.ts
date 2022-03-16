import mongoose, { Schema } from "mongoose";

const MetadataSchema = new Schema({
  name: String,
  performance: Number,
});

const SessionSchema = new Schema({
  keyword: String,
  developer: String,
  version: String,
  timestamp: String,
  schemas: [String],
  metadata: MetadataSchema,
});

type MongooseSession = {
  keyword: string;
  developer: string;
  version: string;
  timestamp: string;
  schemas: string[];
  metadata: {
    name: string;
    performance: number;
  };
};

export const SessionModel = mongoose.model<MongooseSession>(
  "SessionModel",
  SessionSchema,
  "sessions"
);
