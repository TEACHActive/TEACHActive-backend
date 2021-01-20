require("dotenv").config();

// import fs from "fs";
// import https from "https";
import express from "express";
import errorHandler from "errorhandler";

import { config } from "./config";
import * as Const from "./constants";
import * as Controller from "./controllers";
import CreateMongoBot, * as mongo from "./mongo";

const app = express();

const baseEndpoint = "/";

app.use(config);

const controllers = [Controller.canvas, Controller.edusense];
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
  }
};

CreateServer();
