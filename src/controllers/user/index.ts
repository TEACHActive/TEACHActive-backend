import express from "express";
import { DateTime } from "luxon";
import { UserModel } from "../../models/userModel";
import { User } from "./types";

const app = express();

const baseEndpoint = "/user";

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

  try {
    const matchingUser = await UserModel.findById(userID);

    if (!matchingUser) {
      const errorMsg = `User with id: ${userID} not found`;
      console.error(errorMsg);
      res.json({ error: errorMsg });
      return;
    }
    res.json(new User(matchingUser));
  } catch (err) {
    console.error(err);
    res.json({ error: JSON.stringify(err) });
    return;
  }
});

/**
 * Update a user
 */
app.put(`${baseEndpoint}/:id`, async (req, res) => {
  const userID = req.params.id;
  if (userID === undefined) {
    console.error("id must be defined");
    console.error(`User with id: ${userID} not modified`);
  }

  try {
    const updatedUser = await UserModel.findByIdAndUpdate(userID, req.body);

    res.json(new User(updatedUser));
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
 */
app.delete(`${baseEndpoint}/:id`, async (req, res) => {
  const userID = req.params.id;
  if (userID === undefined) {
    console.error("id must be defined");
    console.error(`User with id: ${userID} not deleted`);
  }

  try {
    const deletedUser = await UserModel.findOneAndDelete({ _id: userID });

    res.json(new User(deletedUser));
  } catch (err) {
    console.error(err);
    res.json({ error: JSON.stringify(err) });
    return;
  }
});

export { app as user };
