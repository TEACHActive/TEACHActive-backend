import mongoose, { Schema } from "mongoose";

const MetadataSchema = new Schema({
  name: String,
  performance: Number,
});

export const SessionModel = mongoose.model(
  "SessionModel",
  new Schema({
    keyword: String,
    developer: String,
    version: String,
    timestamp: String,
    schemas: [String],
    metadata: MetadataSchema,
  }),
  "sessions"
);
