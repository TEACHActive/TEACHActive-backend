import admin from "firebase-admin";
import { FirebaseOptions } from "@firebase/app";

import {
  FIREBASE_API_KEY,
  FIREBASE_APP_ID,
  FIREBASE_AUTHDOMAIN,
  FIREBASE_MEASUREMENT_ID,
  FIREBASE_MESSAGING_SENDER_ID,
  FIREBASE_PROJECT_ID,
  FIREBASE_STORAGEBUCKET,
} from "../variables";
import { GOOGLE_APPLICATION_CREDENTIALS } from "../variables";

var serviceAccount = require(`${GOOGLE_APPLICATION_CREDENTIALS}`);

const firebaseClientConfig: FirebaseOptions = {
  apiKey: FIREBASE_API_KEY,
  authDomain: FIREBASE_AUTHDOMAIN,
  projectId: FIREBASE_PROJECT_ID,
  storageBucket: FIREBASE_STORAGEBUCKET,
  messagingSenderId: FIREBASE_MESSAGING_SENDER_ID,
  // databaseURL: ,
  appId: FIREBASE_APP_ID,
  measurementId: FIREBASE_MEASUREMENT_ID,
};

const firebaseAdminConfig = {
  credential: admin.credential.cert(serviceAccount),
};

export { firebaseClientConfig, firebaseAdminConfig };
