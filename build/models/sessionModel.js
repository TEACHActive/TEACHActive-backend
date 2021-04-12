"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SessionModel = void 0;
var mongoose_1 = __importDefault(require("mongoose"));
var Schema = mongoose_1.default.Schema;
var SessionSchema = new Schema({
    keyword: {
        type: String
    },
    developer: {
        type: String
    },
    version: {
        type: String
    },
    timestamp: {
        type: Date
    },
    schemas: {
        type: [String]
    },
    metadata: {
        type: Object
    },
    name: {
        type: String
    },
});
var SessionModel = mongoose_1.default.model("SessionModel", SessionSchema);
exports.SessionModel = SessionModel;
