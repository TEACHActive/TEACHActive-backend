#!/usr/bin/env node

require("dotenv").config();

// import fs from "fs";
// import https from "https";
import express from "express";
import errorHandler from "errorhandler";

import { config } from "./config";
import * as Const from "./constants";
import * as Controller from "./controllers";
import mongoose from "mongoose";
import cors from "cors";

const app = express();

const baseEndpoint = "/";

app.use(cors());
app.use(config);
const url = "mongodb://mongo:27017/teachactive"; //`mongodb://${Const.DB_HOST}:${Const.DB_PORT}/${Const.DB_NAME}`;

const controllers = [
  Controller.user,
  Controller.sessions,
  Controller.reflections,
];
controllers.forEach((controller) => app.use(baseEndpoint, controller));

app.get("/", (req, res) => {
  console.log("Hello World");
  res.end("Hello World");
});

//=====Helper Functuons=====
const CreateServer = async () => {
  if (app.get("env") === "development") {
    const DEV_PORT = Const.PORT;
    app.use(errorHandler());
    app.listen(DEV_PORT);
    console.log(`Running a DEV API server at http://localhost:${DEV_PORT}`); // eslint-disable-line
  } else {
    // const key = fs.readFileSync(`${Const.CERT_DIR}/privkey.pem`);
    // const cert = fs.readFileSync(`${Const.CERT_DIR}/cert.pem`);
    // const options = {
    //   key: key,
    //   cert: cert
    // };
    // const server = https.createServer(options, app);
    // server.listen(Const.PORT, () => {
    //   console.log('Server starting on port: ' + Const.PORT); // eslint-disable-line
    // });
    console.error("prodution not set up yet");
    const DEV_PORT = Const.PORT;
    app.use(errorHandler());
    app.listen(DEV_PORT);
    console.log(`Running a DEV API server at http://localhost:${DEV_PORT}`); // eslint-disable-line
  }
};

mongoose
  .connect(url, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  })
  .then(() => {
    CreateServer();
  });
