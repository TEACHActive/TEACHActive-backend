import { Speaker } from "../sessions/types";

export class SpeechFrame {
  speaker: Speaker;

  constructor(data: any) {
    this.speaker = data.speaker as Speaker;
  }
}

export class SpeechTotals {
  constructor(data: any) {}
}
