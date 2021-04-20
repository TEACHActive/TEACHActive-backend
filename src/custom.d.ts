declare namespace Express {
  export interface Request {
    mongoose: import("mongoose").Mongoose;
  }
}
