export class SessionPerformance {
  sessionId: string;
  performance: number;

  constructor(data: any) {
    this.sessionId = data.sessionId;
    this.performance = data.performance || null;
  }
}
