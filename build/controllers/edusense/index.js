"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.edusense = void 0;
var express_1 = __importDefault(require("express"));
var multer_1 = __importDefault(require("multer"));
var Const = __importStar(require("../../constants"));
var app = express_1.default();
exports.edusense = app;
var baseEndpoint = "/edusense";
var edusenseWorkingDir = Const.EDUSENSE_WORKING_DIR;
var outputDir = edusenseWorkingDir + "/output";
var dest = edusenseWorkingDir + "/input";
var upload = multer_1.default({ dest: dest });
var mongoURL = "mongodb://" + Const.DB_HOST + ":" + Const.DB_PORT + "/" + Const.DB_NAME;
app.get("" + baseEndpoint, function (req, res) {
    console.log("" + baseEndpoint);
    res.end("Hello Edusense");
});
