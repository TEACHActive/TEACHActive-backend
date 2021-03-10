import mongoose from "mongoose";

const Schema = mongoose.Schema;

const UserSchema = new Schema({
  dateCreated: {
    type: Date,
    required: [true],
  },
  name: {
    type: String,
    required: [true],
  },
  oktaID: {
    type: String,
    required: [true],
  },
});

const UserModel = mongoose.model("UserModel", UserSchema);

export { UserModel };
