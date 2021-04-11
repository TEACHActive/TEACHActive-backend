import express from "express";
import { DateTime } from "luxon";
import { SessionModel } from "../../models/sessionModel";
import { UserModel } from "../../models/userModel";
import { Session } from "./types";
import MongoClient, { ObjectId } from "mongodb";

const app = express();

const baseEndpoint = "/edusense/sessions";

/**
 * Get a session
 */
app.get(`${baseEndpoint}/:id`, async (req, res) => {
  const sessionID = req.params.id;
  if (sessionID === undefined) {
    console.error("id must be defined");
  }

  MongoClient.connect(
    "mongodb://localhost:27017/edusense",
    function (err, client) {
      if (err) throw err;

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
    "mongodb://localhost:27017/edusense",
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

export { app as sessions };
