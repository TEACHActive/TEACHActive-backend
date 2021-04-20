import mongoose from "mongoose";

const Schema = mongoose.Schema;

const NestedChoiceQuestionOptionSchema = {
  value: String,
  selected: Boolean,
};

const ChoiceQuestionOptionSchema = new Schema({
  value: {
    type: String,
    required: true,
  },
  selected: Boolean,
  onSelected: new Schema({
    prompt: {
      type: String,
      required: true,
    },
    questionType: {
      type: String,
      required: true,
    },
    ynQuestion: {
      yes: NestedChoiceQuestionOptionSchema,
      no: NestedChoiceQuestionOptionSchema,
      required: false,
    },
    multiChoiceQuestion: {
      options: [NestedChoiceQuestionOptionSchema],
      hasOther: Boolean,
      otherValue: NestedChoiceQuestionOptionSchema,
      required: false,
    },
    singleChoiceQuestion: {
      options: [NestedChoiceQuestionOptionSchema],
      hasOther: Boolean,
      otherValue: NestedChoiceQuestionOptionSchema,
      required: false,
    },
    freeResponseQuestion: {
      feild: NestedChoiceQuestionOptionSchema,
      required: false,
    },
  }),
});

// ChoiceQuestionOptionSchema().virtual('children', {
//   ref: 'Product',
//   localField: '_id',
//   foreignField: 'onSelected'
// });

export const QuestionSchema = new Schema({
  prompt: {
    type: String,
    required: true,
  },
  questionType: {
    type: String,
    required: true,
  },
  questionMetric: {
    type: String,
    required: true,
  },
  ynQuestion: {
    yes: {
      value: String,
      selected: Boolean,
    },
    no: {
      value: String,
      selected: Boolean,
    },
  },
  multiChoiceQuestion: {
    options: [ChoiceQuestionOptionSchema],
    hasOther: Boolean,
    otherValue: ChoiceQuestionOptionSchema,
  },
  singleChoiceQuestion: {
    options: [ChoiceQuestionOptionSchema],
    hasOther: Boolean,
    otherValue: ChoiceQuestionOptionSchema,
  },
  freeResponseQuestion: {
    feild: ChoiceQuestionOptionSchema,
  },
});

// const QuestionModel = mongoose.model("QuestionModel", QuestionSchema);

export const ReflectionsSchema = new Schema({
  userId: {
    type: String,
  },
  sessionId: {
    type: String,
  },
  reflections: {
    type: [QuestionSchema],
  },
});

const ReflectionsModel = mongoose.model("ReflectionsModel", ReflectionsSchema);

export { ReflectionsModel };
