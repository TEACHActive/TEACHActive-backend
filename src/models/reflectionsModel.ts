import mongoose from "mongoose";

const Schema = mongoose.Schema;

const ReflectionsSchema = new Schema({
  userId: {
    type: String,
  },
  sessionId: {
    type: String,
  },
  reflections: {
    type: [
      {
        id: String,
        prompt: String,
      },
    ],
  },
});

const ReflectionsModel = mongoose.model("ReflectionsModel", ReflectionsSchema);

export { ReflectionsModel };
