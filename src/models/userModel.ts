import mongoose, { Schema } from "mongoose";

export class User {
  uid: String;
  email: String;
  name: String;

  constructor(data: any) {
    this.uid = data.uid;
    this.email = data.email;
    this.name = data.name;
  }
}

export const UserModel = mongoose.model<User>(
  "UsernModel",
  new Schema(User),
  "users"
);
