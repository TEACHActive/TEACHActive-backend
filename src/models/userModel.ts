import mongoose, { Schema } from "mongoose";

export class User {
  uid: string;
  email: string;
  name: string;
  isAdmin: boolean;

  constructor(data: any) {
    this.uid = data.uid;
    this.email = data.email;
    this.name = data.name;
    this.isAdmin = data.isAdmin;
  }
}

export const UserModel = mongoose.model<User>(
  "UsernModel",
  new Schema(User),
  "users"
);
