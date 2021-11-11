import { DateTime, Duration } from "luxon";

export class SessionResponse<T extends BaseSession> {
  success: boolean;
  sessions: T[];

  constructor(
    data: any,
    private sessionType: new (
      data: any,
      initialDateTime: DateTime,
      fps: number
    ) => T,
    initialDateTime: DateTime,
    fps: number
  ) {
    this.success = data.success;
    this.sessions = data.sessions.map(
      (session: any) => new sessionType(session, initialDateTime, fps)
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

  static equal(left: BaseSession, right: BaseSession): boolean {
    return left.id === right.id;
  }
}

export class VideoFrameSession extends BaseSession {
  videoFrames: VideoFrame[];

  constructor(data: any, initialDateTime: DateTime, fps: number) {
    super(data);
    this.videoFrames = data.videoFrames.map(
      (videoFrame: any) => new VideoFrame(videoFrame, initialDateTime, fps)
    );
  }
}

export class AudioFrameSession extends BaseSession {
  audioFrames: AudioFrame[];

  constructor(data: any, initialDateTime: DateTime, fps: number) {
    super(data);
    this.audioFrames = data.audioFrames.map(
      (audioFrame: any) => new AudioFrame(audioFrame, initialDateTime, fps)
    );
  }
}

export class VideoFrame {
  frameNumber: number;
  people: Person[];
  timestamp: DateTime;

  constructor(data: any, initialDateTime: DateTime, fps: number) {
    this.frameNumber = data.frameNumber;
    this.people = data.people.map((person: any) => new Person(person));
    // this.timestamp = DateTime.fromSeconds(data.timestamp.unixSeconds);

    this.timestamp = initialDateTime.plus(
      Duration.fromObject({ seconds: Math.round(this.frameNumber / fps) })
    );
    // if (data.frameNumber % 500 == 0) {
    //   console.log(
    //     Math.round(this.frameNumber / fps),
    //     this.timestamp.invalidReason
    //   );

    //   console.log(
    //     this.frameNumber / fps,
    //     initialDateTime.toJSDate().toString(),
    //     this.timestamp.toJSDate().toString()
    //   );
    // }
  }

  serialize = () => {
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

  constructor(data: any, initialDateTime: DateTime, fps: number) {
    this.frameNumber = data.frameNumber;
    this.amplitude = data.audio.amplitude;
    //this.timestamp = DateTime.fromSeconds(data.timestamp.unixSeconds);
    // this.timestamp = DateTime.fromISO(data.timestamp.RFC3339);
    this.timestamp = initialDateTime.plus(
      Duration.fromObject({ seconds: this.frameNumber / fps })
    );
    // if (this.timestamp.year > 2021) {
    //   console.log("WTF", data.timestamp.RFC3339);
    // }
  }

  serialize = () => {
    return { ...this };
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

export enum Speaker {
  Student = "student",
  Instructor = "instructor",
  Ambient = "ambient",
}
