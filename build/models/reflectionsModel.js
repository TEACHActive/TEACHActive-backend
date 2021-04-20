"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReflectionsModel = exports.ReflectionsSchema = exports.QuestionSchema = void 0;
var mongoose_1 = __importDefault(require("mongoose"));
var Schema = mongoose_1.default.Schema;
var NestedChoiceQuestionOptionSchema = {
    value: String,
    selected: Boolean,
};
var ChoiceQuestionOptionSchema = new Schema({
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
exports.QuestionSchema = new Schema({
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
exports.ReflectionsSchema = new Schema({
    userId: {
        type: String,
    },
    sessionId: {
        type: String,
    },
    reflections: {
        type: [exports.QuestionSchema],
    },
});
var ReflectionsModel = mongoose_1.default.model("ReflectionsModel", exports.ReflectionsSchema);
exports.ReflectionsModel = ReflectionsModel;
