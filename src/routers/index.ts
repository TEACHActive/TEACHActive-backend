import {
  router as sessions,
  baseEndpoint as sessionEndpoint,
} from "./sessions";
import {
  router as movement,
  baseEndpoint as movementEndpoint,
} from "./movement";
import {
  router as performance,
  baseEndpoint as performanceEndpoint,
} from "./performance";
import {
  router as reflections,
  baseEndpoint as reflectionsEndpoint,
} from "./reflections";
import { router as user, baseEndpoint as userEndpoint } from "./user";
import { router as auth, baseEndpoint as authEndpoint } from "./auth";
import { router as speech, baseEndpoint as speechEndpoint } from "./speech";
import { router as armPose, baseEndpoint as armPoseEndpoint } from "./armPose";
import {
  router as attendance,
  baseEndpoint as attendanceEndpoint,
} from "./attendance";
import {
  router as sitStand,
  baseEndpoint as sitStandEndpoint,
} from "./sitStand";

export const appRouters = [
  {
    router: sessions,
    endpoint: sessionEndpoint,
  },
  {
    router: user,
    endpoint: userEndpoint,
  },
  {
    router: auth,
    endpoint: authEndpoint,
  },
  {
    router: armPose,
    endpoint: armPoseEndpoint,
  },
  {
    router: movement,
    endpoint: movementEndpoint,
  },
  {
    router: performance,
    endpoint: performanceEndpoint,
  },
  {
    router: reflections,
    endpoint: reflectionsEndpoint,
  },
  {
    router: speech,
    endpoint: speechEndpoint,
  },
  {
    router: attendance,
    endpoint: attendanceEndpoint,
  },
  {
    router: sitStand,
    endpoint: sitStandEndpoint,
  },
];
