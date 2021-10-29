import mongoose from "mongoose";

const Schema = mongoose.Schema;

const NestedChoiceQuestionOptionSchema = {
  value: String,
  label: String,
  selected: Boolean,
};

const ChoiceQuestionOptionSchema = new Schema({
  id: String, // Unique question identifer used to update responses to questions
  value: String, //The response to the question
  priority: Number, //The order of each question in the list (eg. can reorder questions this way). Higher is closer to top
  selected: Boolean, //If the question should be displayed
  required: Boolean,
  placeholder: String,
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
      otherValue: String,
      required: false,
    },
    singleChoiceQuestion: {
      options: [NestedChoiceQuestionOptionSchema],
      hasOther: Boolean,
      otherValue: String,
      required: false,
    },
    freeResponseQuestion: {
      feild: String,
      required: false,
    },
    likertQuestion: {
      value: Number,
      minValue: Number,
      maxValue: Number,
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
    feild: String,
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

export interface ReflectionQuestion {
  id: string; // Unique question identifer used to update responses to questions
  value: string; //The response to the question
  priority: number; //The order of each question in the list (eg. can reorder questions this way). Higher is closer to top
  selected: boolean; //If the question should be displayed
  required: boolean;
  placeholder: string;
  onSelected: {
    prompt: string;
    questionType: string;
    ynQuestion: {
      yes: {
        value: string;
        label: string;
        selected: boolean;
      };
      no: {
        value: string;
        label: string;
        selected: boolean;
      };
    } | null;
    multiChoiceQuestion: {
      options: {
        value: string;
        label: string;
        selected: boolean;
      }[];
      hasOther: boolean;
      otherValue: string;
      otherSelected: boolean;
    } | null;
    singleChoiceQuestion: {
      options: {
        value: string;
        label: string;
        selected: boolean;
      }[];
      hasOther: boolean;
      otherValue: string;
      otherSelected: boolean;
    } | null;
    freeResponseQuestion: {
      feild: string;
    } | null;
    likertQuestion: {
      value: number;
      minValue: number;
      maxValue: number;
    } | null;
  };
}

export interface ReflectionSection {
  name: string;
  title: string;
  questions: ReflectionQuestion[];
}

export interface ReflectionDoc extends mongoose.Document {
  userId: string;
  sessionId: string;
  reflectionSections: ReflectionSection[];
}

const Better_ReflectionsModel = mongoose.model<ReflectionDoc>(
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
