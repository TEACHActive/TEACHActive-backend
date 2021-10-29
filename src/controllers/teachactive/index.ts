import express from "express";
import { DateTime } from "luxon";
import { SessionModel } from "../../models/sessionModel";
import { UserModel } from "../../models/userModel";
import { Session } from "./types";
import MongoClient, { ObjectId } from "mongodb";
import { Response } from "../types";

const app = express();

const baseEndpoint = "/teachactive";

/**
 * Test Endpoint
 */
app.get(`${baseEndpoint}`, function (req, res) {
  res.end("Hello TEACHctive");
});

/**
 * Get a session
 */
app.get(`${baseEndpoint}/:id`, async (req: any, res) => {
  const { mongoose } = req;

  const sessionID = req.params.id;
  if (sessionID === undefined) {
    console.error("id must be defined");
  }

  MongoClient.connect(
    "mongodb://localhost:27019/edusense",
    function (err, client) {
      if (err) {
        console.error(err);
        res.json({ error: "Error connecting to db", detail: err });
        return;
      }

      var db = client.db("edusense");

      db.collection("sessions").findOne(
        { _id: new ObjectId(sessionID) },
        function (err: any, result: any) {
          if (err) throw err;

          res.json(result);
        }
      );
    }
  );
});

/**
 * Update a session name
 */
app.put(`${baseEndpoint}/:id/name`, async (req, res) => {
  const sessionID = req.params.id;
  if (sessionID === undefined) {
    console.error("id must be defined");
  }
  const result = setMetric(sessionID, { name: req.body.name });
  return res.json(result);
});

/**
 * Update a session performance
 */
app.put(`${baseEndpoint}/:id/performance`, async (req, res) => {
  const sessionID = req.params.id;
  if (sessionID === undefined) {
    console.error("id must be defined");
  }
  const result = setMetric(sessionID, { performance: req.body.performance });
  return res.json(result);
});

const setMetric = (sessionID: string, setMetricObj: object): any => {
  MongoClient.connect(
    "mongodb://localhost:27019/edusense",
    function (err, client) {
      if (err) {
        console.error(err);
        return { error: "There was an error", detail: err };
      }

      const db = client.db("edusense");

      db.collection("sessions").updateOne(
        { _id: new ObjectId(sessionID) },
        {
          $set: setMetricObj,
        },
        function (err: any, result: any) {
          if (err) {
            console.error(err);
            return { error: "There was an error", detail: err };
          }

          db.collection("sessions").findOne(
            { _id: new ObjectId(sessionID) },
            function (err: any, result: any) {
              if (err) {
                console.error(err);
                return { error: "There was an error", detail: err };
              }

              return new Session(result).toClient();
            }
          );
        }
      );
    }
  );
};

const instructorUIDToNameMap = new Map([
  ["JxEDspL0SYQhXjfPDXhMaZRZAux1", "Test"],
]);

/**
 * Get a User's Name
 */
app.get(`${baseEndpoint}/name/:uid`, async (req: any, res) => {
  const { uid } = req.params;

  if (uid === undefined) {
    console.error("uid must be defined");
    res.json(new Response(false, null, 404, "uid must be defined as param"));
    return;
  }

  const insturctorName = instructorUIDToNameMap.get(uid) || "";

  res.json(new Response(true, { uid: uid, name: insturctorName }));
});

export { app as sessions };
