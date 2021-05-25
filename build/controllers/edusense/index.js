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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.edusense = void 0;
var express_1 = __importDefault(require("express"));
var types_1 = require("../types");
var controller_1 = require("./controller");
var util_1 = require("./util");
var Constants = __importStar(require("../../constants"));
var app = express_1.default();
exports.edusense = app;
var baseEndpoint = "/edusense";
/**
 * Test Endpoint
 */
app.get("" + baseEndpoint, function (req, res) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            console.log("" + baseEndpoint);
            // const { mongoose } = req;
            // const sessions = await SessionModel.find().exec();
            // res.json(sessions);
            res.end("Hello Edusense");
            return [2 /*return*/];
        });
    });
});
/**
 * Get Sessions by UID
 */
var getSessionsByUIDEndpoint = baseEndpoint + "/sessions/:uid";
app.get(getSessionsByUIDEndpoint, function (req, res) {
    return __awaiter(this, void 0, void 0, function () {
        var uid, response, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    uid = req.params.uid;
                    console.log(uid);
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 6, , 7]);
                    if (!Constants.ADMIN_LIST.includes(uid)) return [3 /*break*/, 3];
                    return [4 /*yield*/, controller_1.getAllSessions()];
                case 2:
                    //User making request is an admin
                    response = _a.sent();
                    return [3 /*break*/, 5];
                case 3: return [4 /*yield*/, controller_1.getSessionsWithMetadataByUID(uid)];
                case 4:
                    //User making request is not an admin
                    response = _a.sent();
                    _a.label = 5;
                case 5: return [3 /*break*/, 7];
                case 6:
                    error_1 = _a.sent();
                    response = new types_1.Response(false, null, 500, "Server error when getting sessions");
                    return [3 /*break*/, 7];
                case 7:
                    res.statusCode = response.statusCode;
                    res.json(response);
                    return [2 /*return*/];
            }
        });
    });
});
/**
 * Get Frames by sessionId
 */
var getFramesBySessionIdEndpoint = baseEndpoint + "/frames/:sessionId/:channel";
app.get(getFramesBySessionIdEndpoint, function (req, res) {
    return __awaiter(this, void 0, void 0, function () {
        var _a, sessionId, channel, response, parsedChannel, error_2;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _a = req.params, sessionId = _a.sessionId, channel = _a.channel;
                    _b.label = 1;
                case 1:
                    _b.trys.push([1, 5, , 6]);
                    parsedChannel = util_1.ParseChannel(channel);
                    if (!!parsedChannel) return [3 /*break*/, 2];
                    response = new types_1.Response(false, null, 400, "Must select channel of type student or instructor");
                    return [3 /*break*/, 4];
                case 2: return [4 /*yield*/, controller_1.getFramesBySessionId(sessionId, parsedChannel)];
                case 3:
                    response = _b.sent();
                    _b.label = 4;
                case 4: return [3 /*break*/, 6];
                case 5:
                    error_2 = _b.sent();
                    response = new types_1.Response(false, null, 500, "Server error when getting frames");
                    return [3 /*break*/, 6];
                case 6:
                    res.statusCode = response.statusCode;
                    res.json(response);
                    return [2 /*return*/];
            }
        });
    });
});
/**
 * Get Number Of Frames Of Arm poses In Session
 */
var getNumberOfFramesOfArmPosesInSessionEndpoint = baseEndpoint + "/armPose/:sessionId";
app.get(getNumberOfFramesOfArmPosesInSessionEndpoint, function (req, res) {
    return __awaiter(this, void 0, void 0, function () {
        var sessionId, response, error_3;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    sessionId = req.params.sessionId;
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, controller_1.getNumberOfFramesOfArmPosesInSession(sessionId)];
                case 2:
                    response = _a.sent();
                    return [3 /*break*/, 4];
                case 3:
                    error_3 = _a.sent();
                    response = new types_1.Response(false, null, 500, "Server error when getting arm poses");
                    return [3 /*break*/, 4];
                case 4:
                    res.statusCode = response.statusCode;
                    res.json(response);
                    return [2 /*return*/];
            }
        });
    });
});
/**
 * Get Arm poses In Session
 */
var getArmPosesInSessionEndpoint = baseEndpoint + "/armPose/frames/:sessionId";
app.get(getArmPosesInSessionEndpoint, function (req, res) {
    return __awaiter(this, void 0, void 0, function () {
        var sessionId, response, error_4;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    sessionId = req.params.sessionId;
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, controller_1.getArmPosesInSession(sessionId)];
                case 2:
                    response = _a.sent();
                    return [3 /*break*/, 4];
                case 3:
                    error_4 = _a.sent();
                    response = new types_1.Response(false, null, 500, "Server error when getting arm pose frames");
                    return [3 /*break*/, 4];
                case 4:
                    res.statusCode = response.statusCode;
                    res.json(response);
                    return [2 /*return*/];
            }
        });
    });
});
/**
 * Get Student Attendance In Session
 */
var getStudentAttendenceStatsInSessionEndpoint = baseEndpoint + "/attendance/:sessionId";
app.get(getStudentAttendenceStatsInSessionEndpoint, function (req, res) {
    return __awaiter(this, void 0, void 0, function () {
        var sessionId, response, error_5;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    sessionId = req.params.sessionId;
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, controller_1.getStudentAttendenceStatsInSession(sessionId)];
                case 2:
                    response = _a.sent();
                    return [3 /*break*/, 4];
                case 3:
                    error_5 = _a.sent();
                    response = new types_1.Response(false, null, 500, "Server error when getting attendence");
                    return [3 /*break*/, 4];
                case 4:
                    res.statusCode = response.statusCode;
                    res.json(response);
                    return [2 /*return*/];
            }
        });
    });
});
/**
 * Get Instructor Movement in Session
 */
var getInstructorMovementEndpoint = baseEndpoint + "/instructor/movement/:sessionId";
app.get(getInstructorMovementEndpoint, function (req, res) {
    return __awaiter(this, void 0, void 0, function () {
        var sessionId, response, error_6;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    sessionId = req.params.sessionId;
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, controller_1.getInstructorMovementInSession(sessionId)];
                case 2:
                    response = _a.sent();
                    return [3 /*break*/, 4];
                case 3:
                    error_6 = _a.sent();
                    response = new types_1.Response(false, null, 500, "Server error when getting instructor movement");
                    return [3 /*break*/, 4];
                case 4:
                    res.statusCode = response.statusCode;
                    res.json(response);
                    return [2 /*return*/];
            }
        });
    });
});
/**
 * Get Sit vs Stand in Session
 */
var getStudentSitVsStandInSessionEndpoint = baseEndpoint + "/student/sitvsstand/:sessionId";
app.get(getStudentSitVsStandInSessionEndpoint, function (req, res) {
    return __awaiter(this, void 0, void 0, function () {
        var sessionId, response, error_7;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    sessionId = req.params.sessionId;
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, controller_1.getStudentSitVsStandInSession(sessionId)];
                case 2:
                    response = _a.sent();
                    return [3 /*break*/, 4];
                case 3:
                    error_7 = _a.sent();
                    response = new types_1.Response(false, null, 500, "Server error when getting Sit vs Stand");
                    return [3 /*break*/, 4];
                case 4:
                    res.statusCode = response.statusCode;
                    res.json(response);
                    return [2 /*return*/];
            }
        });
    });
});
