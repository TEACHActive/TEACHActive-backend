import fs from "fs";
import path from "path";

const { env } = process;

const envLoadError = (envVar: string) =>
  `Could not load ${envVar} env variable`;

//=====Env consts=====
export const PORT = process.env.PORT || 8080;
if (!PORT) throw new Error(envLoadError("PORT")); //Should never error but for consistancy

export const CERT_DIR = env.CERT_DIR;
if (!CERT_DIR) throw new Error(envLoadError("CERT_DIR"));

export const DB_HOST = env.DB_HOST;
if (!DB_HOST) throw new Error(envLoadError("DB_HOST"));

export const DB_PORT_PROD = Number(env.DB_PORT_PROD);
if (!DB_PORT_PROD) throw new Error(envLoadError("DB_PORT_PROD"));

export const DB_PORT_DEV = Number(env.DB_PORT_DEV);
if (!DB_PORT_DEV) throw new Error(envLoadError("DB_PORT_DEV"));

export const DB_USER = env.DB_USER;
if (!DB_USER) throw new Error(envLoadError("DB_USER"));

export const DB_PASS = env.DB_PASS;
if (!DB_PASS) throw new Error(envLoadError("DB_PASS"));

export const DB_NAME = env.DB_NAME;
if (!DB_NAME) throw new Error(envLoadError("DB_NAME"));

export const EDUSENSE_WORKING_DIR = env.EDUSENSE_WORKING_DIR;
if (!EDUSENSE_WORKING_DIR)
  throw new Error(envLoadError("EDUSENSE_WORKING_DIR"));

export const ADMIN_LIST_PROJECT_FILE_PATH = env.ADMIN_LIST_PROJECT_FILE_PATH;
if (!ADMIN_LIST_PROJECT_FILE_PATH)
  throw new Error(envLoadError("ADMIN_LIST_PROJECT_FILE_PATH"));

export const ADMIN_LIST = fs
  .readFileSync(path.join(__dirname, "../", ADMIN_LIST_PROJECT_FILE_PATH))
  .toString()
  .split("\n");
if (!ADMIN_LIST) throw new Error(envLoadError("ADMIN_LIST"));
