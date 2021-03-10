import express from "express";
import { DateTime, Interval } from "luxon";
import { UserModel } from "../../models/userModel";
import { GetUser } from "./engine";
import { User } from "./types";

const app = express();

const baseEndpoint = "/user";

app.get(`${baseEndpoint}`, function (req, res) {
  res.end("Hello User");
});

/**
 * Create a new user
 */
app.post(`${baseEndpoint}`, async (req, res) => {
  const defaultUserData = {
    dateCreated: DateTime.utc(),
    name: "Test User",
    oktaID: "123",
  };
  const newUser = new UserModel({
    dateCreated: req.body.dateCreated || defaultUserData.dateCreated,
    name: req.body.name || defaultUserData.name,
    oktaID: req.body.oktaID || defaultUserData.oktaID,
  });
  try {
    const savedUser = await newUser.save();
    res.json(new User(savedUser));
  } catch (err) {
    if (err) {
      console.error(err);
      res.json({ error: JSON.stringify(err) });
      return;
    }
  }
});

/**
 * Get a user
 */
app.get(`${baseEndpoint}/:id`, async (req, res) => {
  const userID = req.params.id;
  if (userID === undefined) {
    console.error("id must be defined");
  }
  const matchingUser = await GetUser(userID);

  if (!matchingUser) {
    const errorMsg = `User with id: ${userID} not found`;
    console.error(errorMsg);
    res.json({ error: errorMsg });
  }
  res.json(new User(matchingUser));
});

/**
 * Update a user
 * Todo: Fix saving issue
 */
app.put(`${baseEndpoint}/:id`, async (req, res) => {
  const userID = req.params.id;
  if (userID === undefined) {
    console.error("id must be defined");
    console.error(`User with id: ${userID} not modified`);
  }

  try {
    let matchingUser = await GetUser(userID);

    if (!matchingUser) {
      const errorMsg = `User with id: ${userID} not found`;
      console.error(errorMsg);
      res.json({ error: errorMsg });
      return;
    }

    matchingUser = {
      ...matchingUser,
      ...req.body,
    };

    matchingUser?.save();

    res.json(new User(matchingUser));
  } catch (err) {
    if (err) {
      console.error(err);
      res.json({ error: JSON.stringify(err) });
      return;
    }
  }
});

/**
 * Delete a user
 * Todo: Impliment
 */
app.delete(`${baseEndpoint}/:id`, async (req, res) => {});

export { app as user };
