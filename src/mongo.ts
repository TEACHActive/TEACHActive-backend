import { MongoClient, Db } from "mongodb";
import { SessionCollection } from "./types/types";
import * as Const from "./constants";

export class Mongo {
  client: MongoClient;
  db?: Db;
  sessions?: SessionCollection;
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
    this.sessions = new SessionCollection(this.db);
    this.hasInit = true;
  }

  // async insert<T>(newObj: T) {
  //   if(!this.hasInit) {this.init()}
  //   switch(typeof newObj) {
  //     case
  //   }

  // }
}

// const CreateMongoBot = async (): Promise<Mongo> => {
//   const MongoBot = new Mongo();
//   await MongoBot.init();
//   return Promise.resolve(MongoBot);
// };

export default new Mongo();
