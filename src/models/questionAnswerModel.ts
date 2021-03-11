import mongoose from "mongoose";

const Schema = mongoose.Schema;

const QuestionAnswerSchema = new Schema({
  dateCreated: {
    type: Date,
    required: [true],
  },
});

const QuestionAnswerModel = mongoose.model(
  "QuestionAnswerModel",
  QuestionAnswerSchema
);

export { QuestionAnswerModel };
