import mongoose from "mongoose";

const Schema = mongoose.Schema;

const NestedChoiceQuestionOptionSchema = {
  value: String,
  label: String,
  selected: Boolean,
};

const ChoiceQuestionOptionSchema = new Schema({
  value: {
    //The response to the question
    type: String,
    required: true,
  },
  priority: Number, //The order of each question in the list (eg. can reorder questions this way). Higher is closer to top
  selected: Boolean, //If the question should be displayed
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
    likertQuestion: {
      value: NestedChoiceQuestionOptionSchema,
      minValue: NestedChoiceQuestionOptionSchema,
      maxValue: NestedChoiceQuestionOptionSchema,
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

const HandRaisesOptionsSchema = new Schema({
  label: String,
  value: String,
  disabled: Boolean,
  checked: Boolean,
});

export const HandRaisesReflectionSchema = new Schema({
  userId: {
    type: String,
  },
  sessionId: {
    type: String,
  },
  handRaisesReasonOptions: [HandRaisesOptionsSchema],
  handRaiseReasonOther: String,
  satisifedWithHandRaisesValue: String,
  reasonDissatisfiedWithHandRaises: String,
  goalNextSessionValue: String,
  handRaiseGoalOptions: [HandRaisesOptionsSchema],
  handRaiseGoalOther: String,
});

const HandRaisesReflectionModel = mongoose.model(
  "HandRaisesReflectionModel",
  HandRaisesReflectionSchema
);

//=========================================================================================
//=========================================================================================

const Better_ReflectionSectionSchema = new Schema({
  name: String,
  title: String,
  questions: [ChoiceQuestionOptionSchema],
});

const Better_ReflectionsSchema = new Schema({
  userId: String,
  sessionId: String,
  reflectionSections: [Better_ReflectionSectionSchema],
});

const Better_ReflectionsModel = mongoose.model(
  "Better_ReflectionsModel",
  Better_ReflectionsSchema
);

//=========================================================================================
//=========================================================================================

export {
  ReflectionsModel,
  HandRaisesReflectionModel,
  Better_ReflectionsModel,
  Better_ReflectionSectionSchema,
};
