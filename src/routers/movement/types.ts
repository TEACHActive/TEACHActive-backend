import { DateTime, DurationObject } from "luxon";
import { BodyPart } from "../sessions/types";

export class InstructorMovementFrame {
  instructor: {
    xPos: number;
    yPos: number;
  };
  timestamp: DateTime;
  frameNumber: number;
  timeDiff: DurationObject;
  foundInstructor: boolean;

  constructor(data: any) {
    this.instructor = {
      xPos: data.instructor?.body.bodyParts.get(BodyPart.Neck)?.x,
      yPos: data.instructor?.body.bodyParts.get(BodyPart.Neck)?.y,
    };
    this.timestamp = data.timestamp;
    this.frameNumber = data.frameNumber;
    this.timeDiff = data.timeDiff;
    this.foundInstructor = data.foundInstructor;
  }
}

export interface InstructorMovementFrameResponse {
  timestamp: {
    begin: DateTime;
    end: DateTime;
  };
  frameNumber: {
    begin: number;
    avg: number;
    end: number;
  };
  timeDiff: DurationObject;
  instructor: {
    //Todo: may benifit from adding quantiles (ex instructor gets mixed with students and that pulls avg down)
    avg: {
      xPos: number;
      yPos: number;
    };
    min: {
      xPos: number;
      yPos: number;
    };
    max: {
      xPos: number;
      yPos: number;
    };
  };
}
