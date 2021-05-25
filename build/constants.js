"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ADMIN_LIST = exports.ADMIN_LIST_FILE_PATH = exports.EDUSENSE_WORKING_DIR = exports.DB_NAME = exports.DB_PASS = exports.DB_USER = exports.DB_PORT = exports.DB_HOST = exports.CERT_DIR = exports.PORT = void 0;
var fs_1 = __importDefault(require("fs"));
var env = process.env;
var envLoadError = function (envVar) {
    return "Could not load " + envVar + " env variable";
};
//=====Env consts=====
exports.PORT = process.env.PORT || 8080;
if (!exports.PORT)
    throw new Error(envLoadError("PORT")); //Should never error but for consistancy
exports.CERT_DIR = env.CERT_DIR;
if (!exports.CERT_DIR)
    throw new Error(envLoadError("CERT_DIR"));
exports.DB_HOST = env.DB_HOST;
if (!exports.DB_HOST)
    throw new Error(envLoadError("DB_HOST"));
exports.DB_PORT = Number(env.DB_PORT);
if (!exports.DB_PORT)
    throw new Error(envLoadError("DB_PORT"));
exports.DB_USER = env.DB_USER;
if (!exports.DB_USER)
    throw new Error(envLoadError("DB_USER"));
exports.DB_PASS = env.DB_PASS;
if (!exports.DB_PASS)
    throw new Error(envLoadError("DB_PASS"));
exports.DB_NAME = env.DB_NAME;
if (!exports.DB_NAME)
    throw new Error(envLoadError("DB_NAME"));
exports.EDUSENSE_WORKING_DIR = env.EDUSENSE_WORKING_DIR;
if (!exports.EDUSENSE_WORKING_DIR)
    throw new Error(envLoadError("EDUSENSE_WORKING_DIR"));
exports.ADMIN_LIST_FILE_PATH = env.ADMIN_LIST_FILE_PATH;
if (!exports.ADMIN_LIST_FILE_PATH)
    throw new Error(envLoadError("ADMIN_LIST_FILE_PATH"));
exports.ADMIN_LIST = fs_1.default
    .readFileSync(exports.ADMIN_LIST_FILE_PATH)
    .toString()
    .split("\n");
if (!exports.ADMIN_LIST)
    throw new Error(envLoadError("ADMIN_LIST"));
