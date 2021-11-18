import fs from "fs";
import path from "path";

const { env } = process;

const falsyPrimitives = {
  string: "",
  intAsString: "0",
};

const envLoadError = (envVar: string) =>
  `Could not load ${envVar} env variable`;

//=====Env consts=====
export const PORT: number = parseInt(process.env.PORT || "8080");
if (!PORT) throw Error(envLoadError("PORT")); //Should never error but for consistancy

export const CERT_DIR: string = env.CERT_DIR || falsyPrimitives.string;
if (!CERT_DIR) throw Error(envLoadError("CERT_DIR"));

export const DB_HOST: string = env.DB_HOST || falsyPrimitives.string;
if (!DB_HOST) throw Error(envLoadError("DB_HOST"));

export const DB_PORT_PROD: number = parseInt(env.DB_PORT_PROD || "4000");
if (!DB_PORT_PROD) throw Error(envLoadError("DB_PORT_PROD"));

export const DB_PORT_DEV: number = parseInt(env.DB_PORT_DEV || "4001");
if (!DB_PORT_DEV) throw Error(envLoadError("DB_PORT_DEV"));

export const DB_USER: string = env.DB_USER || falsyPrimitives.string;
if (!DB_USER) throw Error(envLoadError("DB_USER"));

export const DB_PASS: string = env.DB_PASS || falsyPrimitives.string;
if (!DB_PASS) throw Error(envLoadError("DB_PASS"));

export const DB_NAME: string = env.DB_NAME || falsyPrimitives.string;
if (!DB_NAME) throw Error(envLoadError("DB_NAME"));

export const EDUSENSE_WORKING_DIR: string =
  env.EDUSENSE_WORKING_DIR || falsyPrimitives.string;
if (!EDUSENSE_WORKING_DIR) throw Error(envLoadError("EDUSENSE_WORKING_DIR"));

export const ADMIN_LIST_PROJECT_FILE_PATH: string =
  env.ADMIN_LIST_PROJECT_FILE_PATH || falsyPrimitives.string;
if (!ADMIN_LIST_PROJECT_FILE_PATH)
  throw Error(envLoadError("ADMIN_LIST_PROJECT_FILE_PATH"));

export const ADMIN_LIST = fs
  .readFileSync(path.join(__dirname, "../", ADMIN_LIST_PROJECT_FILE_PATH))
  .toString()
  .split("\n");
if (!ADMIN_LIST) throw Error(envLoadError("ADMIN_LIST"));

export const TOKEN_SECRET: string = env.TOKEN_SECRET || falsyPrimitives.string;
if (!TOKEN_SECRET) throw Error(envLoadError("TOKEN_SECRET"));

//=====Firebase=====
//==================

export const FIREBASE_API_KEY: string =
  process.env.FIREBASE_API_KEY || falsyPrimitives.string;
if (!FIREBASE_API_KEY) {
  envLoadError("FIREBASE_API_KEY");
}

export const FIREBASE_AUTHDOMAIN: string =
  process.env.FIREBASE_AUTHDOMAIN || falsyPrimitives.string;
if (!FIREBASE_AUTHDOMAIN) {
  envLoadError("FIREBASE_AUTHDOMAIN");
}

export const FIREBASE_PROJECT_ID: string =
  process.env.FIREBASE_PROJECT_ID || falsyPrimitives.string;
if (!FIREBASE_PROJECT_ID) {
  envLoadError("FIREBASE_PROJECT_ID");
}

export const FIREBASE_STORAGEBUCKET: string =
  process.env.FIREBASE_STORAGEBUCKET || falsyPrimitives.string;
if (!FIREBASE_STORAGEBUCKET) {
  envLoadError("FIREBASE_STORAGEBUCKET");
}

export const FIREBASE_MESSAGING_SENDER_ID: string =
  process.env.FIREBASE_MESSAGING_SENDER_ID || falsyPrimitives.string;
if (!FIREBASE_MESSAGING_SENDER_ID) {
  envLoadError("FIREBASE_MESSAGING_SENDER_ID");
}

export const FIREBASE_APP_ID: string =
  process.env.FIREBASE_APP_ID || falsyPrimitives.string;
if (!FIREBASE_APP_ID) {
  envLoadError("FIREBASE_APP_ID");
}

export const FIREBASE_MEASUREMENT_ID: string =
  process.env.FIREBASE_MEASUREMENT_ID || falsyPrimitives.string;
if (!FIREBASE_MEASUREMENT_ID) {
  envLoadError("FIREBASE_MEASUREMENT_ID");
}

export const GOOGLE_APPLICATION_CREDENTIALS: string =
  env.GOOGLE_APPLICATION_CREDENTIALS || falsyPrimitives.string;
if (!GOOGLE_APPLICATION_CREDENTIALS)
  envLoadError("GOOGLE_APPLICATION_CREDENTIALS");
