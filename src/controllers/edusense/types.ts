import { DateTime } from "luxon";

export class SessionResponse<T extends BaseSession> {
  success: boolean;
  sessions: T[];

  constructor(data: any, private sessionType: new (data: any) => T) {
    this.success = data.success;
    this.sessions = data.sessions.map(
      (session: any) => new sessionType(session)
    );
  }
}

export class BaseSession {
  id: string;
  createdAt: DateTime;
  name: string;
  performance: number | null;
  keyword?: string;

  constructor(data: any) {
    this.id = data.id;
    this.createdAt = this.getCreatedAtFromData(data);
    this.name = this.getNameFromData(data);
    this.performance = this.getPerformanceFromData(data);
    this.keyword = data.keyword;
  }

  private getPerformanceFromData(data: any): number | null {
    if (data.performance) {
      return data.performance;
    }
    if (data.metadata && data.metadata.performance) {
      return data.metadata.performance;
    }
    return null;
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

  static equal(left: BaseSession, right: BaseSession): boolean {
    return left.id === right.id;
  }
}

export class VideoFrameSession extends BaseSession {
  videoFrames: VideoFrame[];

  constructor(data: any) {
    super(data);
    this.videoFrames = data.videoFrames.map(
      (videoFrame: any) => new VideoFrame(videoFrame)
    );
  }
}

export class VideoFrame {
  frameNumber: number;
  people: Person[];
  timestamp: DateTime;

  constructor(data: any) {
    this.frameNumber = data.frameNumber;
    this.people = data.people.map((person: any) => new Person(person));
    this.timestamp = DateTime.fromSeconds(data.timestamp.unixSeconds);
  }

  serialize = () => {
    return {
      ...this,
      people: this.people.map((person) => person.serialize()),
    };
  };
}

export class Person {
  openposeId: number;
  trackingId: number;
  armpose: ArmPose;
  sitStand: SitStand;
  body: Body;

  constructor(data: any) {
    this.openposeId = data.openposeId;
    this.trackingId = data.inference ? data.inference.trackingId : -1;
    this.armpose = data.inference
      ? data.inference.posture.armPose
      : ArmPose.Error;
    this.sitStand = data.inference
      ? data.inference.posture.sitStand
      : SitStand.Error;
    this.body = new Body(data.body);
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
  Other = "other",
  HandsRaised = "handsRaised",
  ArmsCrossed = "armsCrossed",
  HandsOnFace = "handsOnFace",
  Error = "error",
}

export enum SitStand {
  Sit = "sit",
  Stand = "stand",
  Error = "error",
}

export enum Channel {
  Student = "student",
  Instructor = "instructor",
}
