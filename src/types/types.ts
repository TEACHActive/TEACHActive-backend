import { Collection, Db } from "mongodb";
import { Session } from "./edusense.types";

export class SessionCollection {
  collection: Collection<Session>;
  constructor(db: Db) {
    this.collection = db.collection("sessions");
  }
  async addSession(session: Session) {
    const newSession = await this.collection.insertOne(session);
    return newSession;
  }
}
