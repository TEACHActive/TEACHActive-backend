"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReflectionsModel = void 0;
var mongoose_1 = __importDefault(require("mongoose"));
var Schema = mongoose_1.default.Schema;
var ReflectionsSchema = new Schema({
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
var ReflectionsModel = mongoose_1.default.model("ReflectionsModel", ReflectionsSchema);
exports.ReflectionsModel = ReflectionsModel;
