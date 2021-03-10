import { MongoClient, Db } from "mongodb";
import mongoose from "mongoose";

import { SessionCollection } from "./types/types";
import * as Const from "./constants";

export class Mongo {
  client: MongoClient;
  db?: Db;
  // sessions?: SessionCollection;
  hasInit: boolean;
  constructor() {
    const url = `mongodb://${Const.DB_HOST}:${Const.DB_PORT}/${Const.DB_NAME}`;
    this.client = new MongoClient(url);
    this.hasInit = false;
  }
  async init() {
    await this.client.connect();
    console.log("connected");

    this.db = this.client.db();
    // this.sessions = new SessionCollection(this.db);
    this.hasInit = true;
  }
}

export default new Mongo();
