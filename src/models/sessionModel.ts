import mongoose from "mongoose";

const Schema = mongoose.Schema;

const SessionSchema = new Schema({
    keyword: {
        type: String
    },
    developer: {
        type: String
    },
    version: {
        type: String
    },
    timestamp: {
        type: Date
    },
    schemas: {
        type: [String]
    },
    metadata: {
        type: Object
    },
    name: {
        type: String
    },
});

const SessionModel = mongoose.model("SessionModel", SessionSchema);

export {SessionModel}