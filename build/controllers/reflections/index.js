"use strict";
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
exports.reflections = void 0;
var express_1 = __importDefault(require("express"));
var reflectionsModel_1 = require("../../models/reflectionsModel");
var app = express_1.default();
exports.reflections = app;
var baseEndpoint = "/reflections";
/**
 * Create/Update a new reflection
 */
app.put(baseEndpoint + "/:uid/:sessionId", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, uid, sessionId, reflections, matchingReflection, newReflection, savedReflection, updatedReflection, err_1;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _a = req.params, uid = _a.uid, sessionId = _a.sessionId;
                reflections = req.body.reflections;
                if (uid === undefined) {
                    console.error("id must be defined");
                    res.status(400);
                    res.json({
                        error: "Must Provide userId",
                        detail: "Must Provide userId",
                    });
                    return [2 /*return*/];
                }
                if (sessionId === undefined) {
                    console.error("sessionId must be defined");
                    res.status(400);
                    res.json({
                        error: "Must Provide sessionId",
                        detail: "Must Provide sessionId",
                    });
                    return [2 /*return*/];
                }
                _b.label = 1;
            case 1:
                _b.trys.push([1, 6, , 7]);
                return [4 /*yield*/, reflectionsModel_1.ReflectionsModel.findOne({
                        userId: uid,
                        sessionId: sessionId,
                    })];
            case 2:
                matchingReflection = _b.sent();
                if (!!matchingReflection) return [3 /*break*/, 4];
                newReflection = new reflectionsModel_1.ReflectionsModel({
                    userId: uid,
                    sessionId: sessionId,
                    reflections: reflections,
                });
                return [4 /*yield*/, newReflection.save()];
            case 3:
                savedReflection = _b.sent();
                res.status(201);
                res.json(savedReflection);
                return [2 /*return*/];
            case 4: return [4 /*yield*/, reflectionsModel_1.ReflectionsModel.updateOne({
                    userId: uid,
                    sessionId: sessionId,
                }, { reflections: reflections })];
            case 5:
                updatedReflection = _b.sent();
                res.status(200);
                res.json(updatedReflection);
                console.log(updatedReflection);
                return [2 /*return*/];
            case 6:
                err_1 = _b.sent();
                console.error(err_1);
                res.status(500);
                res.json({
                    error: "error when creating/updating reflection",
                    detail: JSON.stringify(err_1),
                });
                return [2 /*return*/];
            case 7: return [2 /*return*/];
        }
    });
}); });
/**
 * Get a reflection
 */
app.get(baseEndpoint + "/:uid/:sessionId", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, uid, sessionId, matchingReflection, errorMsg, err_2;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _a = req.params, uid = _a.uid, sessionId = _a.sessionId;
                if (uid === undefined) {
                    console.error("id must be defined");
                    res.status(400);
                    res.json({
                        error: "Must Provide userId",
                        detail: "Must Provide userId",
                    });
                    return [2 /*return*/];
                }
                if (sessionId === undefined) {
                    console.error("sessionId must be defined");
                    res.status(400);
                    res.json({
                        error: "Must Provide sessionId",
                        detail: "Must Provide sessionId",
                    });
                    return [2 /*return*/];
                }
                _b.label = 1;
            case 1:
                _b.trys.push([1, 3, , 4]);
                return [4 /*yield*/, reflectionsModel_1.ReflectionsModel.findOne({
                        userId: uid,
                        sessionId: sessionId,
                    })];
            case 2:
                matchingReflection = _b.sent();
                console.log(matchingReflection);
                if (!matchingReflection) {
                    errorMsg = "User with id: " + uid + " and sessionId " + sessionId + " not found";
                    console.error(errorMsg);
                    res.status(404);
                    res.json({
                        error: "error when creating/updating reflection",
                        detail: JSON.stringify(errorMsg),
                    });
                    return [2 /*return*/];
                }
                res.status(200);
                res.json(matchingReflection);
                return [3 /*break*/, 4];
            case 3:
                err_2 = _b.sent();
                console.error(err_2);
                res.status(500);
                res.json({ error: JSON.stringify(err_2) });
                return [2 /*return*/];
            case 4: return [2 /*return*/];
        }
    });
}); });
