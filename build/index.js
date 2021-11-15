#!/usr/bin/env node
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
require("dotenv").config();
var fs_1 = __importDefault(require("fs"));
var cors_1 = __importDefault(require("cors"));
var https_1 = __importDefault(require("https"));
var express_1 = __importDefault(require("express"));
var mongoose_1 = __importDefault(require("mongoose"));
var errorhandler_1 = __importDefault(require("errorhandler"));
var config_1 = require("./config");
var Const = __importStar(require("./variables"));
var routers_1 = require("./routers");
var app = express_1.default();
app.use(config_1.config);
app.use(cors_1.default());
app.options("*", function (req, res, next) {
    next();
}, cors_1.default());
//=====Helper Functuons=====
var CreateServer = function (mongoose) { return __awaiter(void 0, void 0, void 0, function () {
    var server, DEV_PORT_1, key, cert, options, key, cert, options;
    return __generator(this, function (_a) {
        routers_1.appRouters.forEach(function (appRouter) {
            app.use(appRouter.endpoint, appRouter.router);
        });
        if (app.get("env") === "development") {
            DEV_PORT_1 = Const.PORT;
            app.use(errorhandler_1.default());
            key = fs_1.default.readFileSync(Const.CERT_DIR + "/ssl_cert_private_key");
            cert = fs_1.default.readFileSync(Const.CERT_DIR + "/ssl_cert");
            options = {
                key: key,
                cert: cert,
            };
            server = https_1.default.createServer(options, app);
            server.listen(DEV_PORT_1, function () {
                console.log("Running a DEV API server at http://localhost:" + DEV_PORT_1); // eslint-disable-line
            });
        }
        else {
            key = fs_1.default.readFileSync("/app/" + Const.CERT_DIR + "/ssl_cert_private_key");
            cert = fs_1.default.readFileSync("/app/" + Const.CERT_DIR + "/ssl_cert");
            options = {
                key: key,
                cert: cert,
            };
            server = https_1.default.createServer(options, app);
            server.listen(Const.PORT, function () {
                console.log("Server starting on port: " + Const.PORT); // eslint-disable-line
            });
        }
        return [2 /*return*/];
    });
}); };
var mongooseConnectionOptions = {
    useCreateIndex: true,
    useNewUrlParser: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
};
var url = "mongodb://localhost:" + Const.DB_PORT_PROD + "/" + Const.DB_NAME;
var dev_url = "mongodb://localhost:" + Const.DB_PORT_DEV + "/" + Const.DB_NAME;
mongoose_1.default
    .connect(process.env.NODE_ENV === "production" ? url : dev_url, mongooseConnectionOptions)
    .then(function (mongoose) {
    CreateServer(mongoose);
});
//# sourceMappingURL=index.js.map