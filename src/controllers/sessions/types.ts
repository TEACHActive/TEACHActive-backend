import { DateTime } from "luxon";

export class Session {
  id: string;
  keyword: string;
  developer: string;
  version: string;
  timestamp: DateTime;
  schemas: string[];
  metadata: any;
  name: string;
  performance: number;

  constructor(data: any) {
    this.id = data._id || data.id;
    this.keyword = data.keyword;
    this.developer = data.developer;
    this.version = data.version;
    this.timestamp = DateTime.fromISO(data.timestamp);
    this.schemas = data.schemas;
    this.metadata = data.metadata;
    this.name = data.name;
    this.performance = data.performance;
  }

  toClient = () => {
    return {
      id: this.id,
      keyword: this.keyword,
      metadata: this.metadata,
      name: this.name,
      performance: this.performance,
    };
  };
}
