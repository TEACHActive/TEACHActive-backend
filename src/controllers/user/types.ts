import { DateTime } from "luxon";

export class User {
  id: string;
  dateCreated: DateTime;
  name: string;
  oktaID: string;
  constructor(data: any) {
    this.id = data._id || data.id;
    this.dateCreated = data.dateCreated;
    this.name = data.name;
    this.oktaID = data.oktaID;
  }
}
