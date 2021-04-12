"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.QuestionAnswerModel = void 0;
var mongoose_1 = __importDefault(require("mongoose"));
var Schema = mongoose_1.default.Schema;
var QuestionAnswerSchema = new Schema({
    dateCreated: {
        type: Date,
        required: [true],
    },
});
var QuestionAnswerModel = mongoose_1.default.model("QuestionAnswerModel", QuestionAnswerSchema);
exports.QuestionAnswerModel = QuestionAnswerModel;
