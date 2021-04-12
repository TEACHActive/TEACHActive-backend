"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserModel = void 0;
var mongoose_1 = __importDefault(require("mongoose"));
var Schema = mongoose_1.default.Schema;
var UserSchema = new Schema({
    dateCreated: {
        type: Date,
        required: [true],
    },
    name: {
        type: String,
        required: [true],
    },
    oktaID: {
        type: String,
        required: [true],
    },
});
var UserModel = mongoose_1.default.model("UserModel", UserSchema);
exports.UserModel = UserModel;
