import { DateTime } from "luxon";
import { SitStand } from "../sessions/types";

export class SitStandInFrame {
  [SitStand.Sit]: number;
  [SitStand.Stand]: number;
  [SitStand.Error]: number;
  frameNumber: number;
  timestamp: {
    begin: DateTime;
    end: DateTime;
  };
  timeDiff: {
    minutes?: number;
  };

  constructor(data: any) {
    this[SitStand.Sit] = data[SitStand.Sit];
    this[SitStand.Stand] = data[SitStand.Stand];
    this[SitStand.Error] = data[SitStand.Error];
    this.frameNumber = data.frameNumber;
    this.timestamp = {
      begin: data.timestamp.begin,
      end: data.timestamp.end,
    };
    this.timeDiff = {
      minutes: data.timeDiff.minutes,
    };
  }
}
