import { DateTime, Duration, DurationObject } from "luxon";

export class Session {
  id: string;
  name?: string;
  userUID: string;
  createdAt: DateTime;
  performance?: number;

  constructor(data: any, fps: number) {
    this.id = data.id;
    this.name = this.getNameFromData(data);
    this.userUID = data.keyword; // keyword is the userUID
    this.createdAt = this.getCreatedAtFromData(data);
    this.performance = this.getPerformanceFromData(data);
  }

  private getPerformanceFromData(data: any): number | undefined {
    if (data.performance) {
      return data.performance;
    }
    if (data.metadata && data.metadata.performance) {
      return data.metadata.performance;
    }
    return undefined;
  }

  private getCreatedAtFromData(data: any): DateTime {
    if (!data.createdAt) {
      if (data.timestamp) {
        //Check to see if created at is string and ISO
        const parsedDateTime = DateTime.fromJSDate(new Date(data.timestamp));

        if (parsedDateTime.isValid) {
          return parsedDateTime;
        }
      }
      return DateTime.fromJSDate(new Date()); //Currently some issue with DateTime.now()?
    }
    if (DateTime.isDateTime(data.createdAt)) {
      return data.createdAt;
    }
    if (data.createdAt.unixSeconds) {
      return DateTime.fromSeconds(data.createdAt.unixSeconds);
    }
    if (data.createdAt.RFC3339) {
      return DateTime.fromISO(data.createdAt.RFC3339);
    }
    if (DateTime.fromISO(data.createdAt).isValid) {
      return DateTime.fromISO(data.createdAt);
    }
    return DateTime.fromJSDate(new Date()); //Currently some issue with DateTime.now()?
  }

  private getNameFromData(data: any): string {
    if (data.metadata && data.metadata.name) {
      //Getting directly from database
      return data.metadata.name;
    }
    if (data.name) {
      return data.name;
    }
    if (DateTime.isDateTime(data.createdAt)) {
      return data.createdAt.toLocaleString();
    }
    if (data.createdAt && data.createdAt.unixSeconds) {
      return DateTime.fromSeconds(data.createdAt.unixSeconds).toLocaleString();
    }
    if (data.timestamp) {
      //Check to see if created at is string and ISO
      const parsedDateTime = DateTime.fromJSDate(new Date(data.timestamp));
      if (parsedDateTime.isValid) {
        return parsedDateTime.toLocaleString();
      }
    }
    return data.id;
  }

  static equal(left: Session, right: Session): boolean {
    return left.id === right.id;
  }
}

// export interface VideoFrame {
//   frameNumber: number;
//   people: Person[];
//   timestamp: DateTime;
// }

// export const createVideoFrame = (data: any, initialDateTime: DateTime, fps: number) => {
//   return {
//     frameNumber: data.frameNumber,
//     people: data.people.map((person: any) => {
//       return {
//         openposeId: number;
//         trackingId: number;
//         armpose: ArmPose;
//         body: Body;
//         sitStand: SitStand;
//       }
//     })
//   }
// }
export class VideoFrame {
  frameNumber: number;
  people: Person[];
  timestamp: DateTime;

  constructor(data: any, initialDateTime: DateTime, fps: number) {
    this.frameNumber = data.frameNumber;
    this.people = data.people.map((person: any) => new Person(person));
    this.timestamp = initialDateTime.plus(
      Duration.fromObject({ seconds: Math.round(this.frameNumber / fps) })
    );
  }

  serialize = (): VideoFrame | null => {
    return {
      ...this,
      people: this.people.map((person) => person.serialize()),
    };
  };
}

export class AudioFrame {
  frameNumber: number;
  timestamp: DateTime;
  amplitude: number;
  timeDiff?: DurationObject;

  constructor(data: any, initialDateTime: DateTime, fps: number) {
    this.frameNumber = data.frameNumber;

    this.amplitude = data.audio.amplitude;
    this.timestamp = initialDateTime.plus(
      Duration.fromObject({ seconds: this.frameNumber / fps })
    );
  }

  serialize = () => {
    return { ...this };
  };
}

export enum LimitedDurationUnit {
  Seconds = "seconds",
  Minutes = "minutes",
  Frames = "frames",
}

export class Person {
  openposeId: number;
  trackingId: number;
  armpose: ArmPose;
  body: Body;
  sitStand: SitStand;

  constructor(data: any) {
    this.openposeId = data.openposeId;
    this.trackingId = data.inference ? data.inference.trackingId : -1;
    this.armpose = data.inference
      ? data.inference.posture.armPose
      : ArmPose.Error;
    this.body = new Body(data.body);
    this.sitStand = data.inference
      ? data.inference.posture.sitStand
      : SitStand.Error;

    const personHasLowerBody =
      this.body.bodyParts.get(BodyPart.RAnkle)?.confident &&
      this.body.bodyParts.get(BodyPart.LAnkle)?.confident;
    if (!personHasLowerBody && this.sitStand === SitStand.Error) {
      //We will quantify this as a sit pose since there are some desks that occulude lower bodies
      this.sitStand = SitStand.Sit;
    }
  }

  serialize = () => {
    return {
      ...this,
      body: this.body.serialize(),
    };
  };
}

export class Body {
  bodyParts: Map<BodyPart, { x: number; y: number; confident: boolean }>;

  constructor(body: number[]) {
    this.bodyParts = new Map();

    for (
      let bodyPartIndex = 0;
      bodyPartIndex < body.length - 2;
      bodyPartIndex += 3
    ) {
      const bodyPartX = body[bodyPartIndex];
      const bodyPartY = body[bodyPartIndex + 1];
      const bodyPartConfidence = body[bodyPartIndex + 2] === 1 ? true : false; // Is either 0 or 1 representing not confident or confident
      this.bodyParts.set(bodyPartIndex / 3, {
        x: bodyPartX,
        y: bodyPartY,
        confident: bodyPartConfidence,
      });
    }
  }

  serialize = () => {
    return JSON.stringify(Array.from(this.bodyParts.entries()));
  };
}

export enum BodyPart {
  Nose = 0,
  Neck = 1,
  RShoulder = 2,
  RElbow = 3,
  RWrist = 4,
  LShoulder = 5,
  LElbow = 6,
  LWrist = 7,
  MidHip = 8,
  RHip = 9,
  RKnee = 10,
  RAnkle = 11,
  LHip = 12,
  LKnee = 13,
  LAnkle = 14,
  REye = 15,
  LEye = 16,
  REar = 17,
  LEar = 18,
  LBigToe = 19,
  LSmallToe = 20,
  LHeel = 21,
  RBigToe = 22,
  RSmallToe = 23,
  RHeel = 24,
  Background = 25,
}

export enum ArmPose {
  Error = "error",
  Other = "other",
  HandsRaised = "handsRaised",
  ArmsCrossed = "armsCrossed",
  HandsOnFace = "handsOnFace",
}

export enum SitStand {
  Sit = "sit",
  Stand = "stand",
  Error = "error",
}

export enum VideoChannel {
  Student = "student",
  Instructor = "instructor",
}

export enum AudioChannel {
  Student = "instructor",
  Instructor = "student",
}

export enum Speaker {
  Student = "student",
  Instructor = "instructor",
  Ambient = "ambient",
  Silent = "silent",
}
