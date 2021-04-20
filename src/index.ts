#!/usr/bin/env node

require("dotenv").config();

import fs from "fs";
import https from "https";
import express from "express";
import errorHandler from "errorhandler";

import { config } from "./config";
import * as Const from "./constants";
import * as Controller from "./controllers";
import mongoose from "mongoose";
import cors from "cors";
import { Server } from "http";

const app = express();
app.use(config);
app.use(cors());

//=====Helper Functuons=====
const CreateServer = async (mongoose: mongoose.Mongoose) => {
  const baseEndpoint = "/";

  const controllers = [
    Controller.edusense,
    Controller.user,
    Controller.sessions,
    Controller.reflections,
    Controller.metadata,
  ];
  controllers.forEach((controller) =>
    app.use(
      baseEndpoint,
      (req: any, res, next) => {
        req.mongoose = mongoose;
        next();
      },
      controller
    )
  );

  app.get(baseEndpoint, (req, res) => {
    console.log("Hello World");
    res.end("Hello World");
  });

  let server: https.Server | Server;

  if (app.get("env") === "development") {
    const DEV_PORT = Const.PORT;
    app.use(errorHandler());

    server = app.listen(DEV_PORT, () => {
      console.log(`Running a DEV API server at http://localhost:${DEV_PORT}`); // eslint-disable-line
    });
  } else {
    const key = fs.readFileSync(`${Const.CERT_DIR}/ssl_cert_private_key`);
    const cert = fs.readFileSync(`${Const.CERT_DIR}/ssl_cert`);
    const options = {
      key: key,
      cert: cert,
    };
    server = https.createServer(options, app);
    server.listen(Const.PORT, () => {
      console.log("Server starting on port: " + Const.PORT); // eslint-disable-line
    });
  }
};

const mongooseConnectionOptions = {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
};

const url = `mongodb://${Const.DB_HOST}:${Const.DB_PORT}/${Const.DB_NAME}`;
const dev_url = `mongodb://localhost:${Const.DB_PORT}/${Const.DB_NAME}`;

mongoose
  .connect(
    process.env.NODE_ENV === "production" ? url : dev_url,
    mongooseConnectionOptions
  )
  .then((mongoose) => {
    CreateServer(mongoose);
  });
