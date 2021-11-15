import { DateTime, DurationObject } from "luxon";

export class InstructorMovementFrame {
  xPos: number;
  yPos: number;
  timestamp: DateTime;
  frameNumber: number;
  timeDiff: DurationObject;

  constructor(data: any) {
    this.xPos = data.xPos;
    this.yPos = data.yPos;
    this.timestamp = data.timestamp;
    this.frameNumber = data.frameNumber;
    this.timeDiff = data.timeDiff;
  }
}
