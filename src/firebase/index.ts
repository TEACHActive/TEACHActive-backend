import { initializeApp } from "firebase/app";
import {
  applicationDefault,
  initializeApp as initializeAdminApp,
} from "firebase-admin/app";
import { getAuth } from "firebase/auth";

import { firebaseClientConfig, firebaseAdminConfig } from "./firebaseConfig";

const app = initializeApp(firebaseClientConfig);

const adminApp = initializeAdminApp(firebaseAdminConfig, "adminApp");

export const auth = getAuth();

export { app, adminApp };
