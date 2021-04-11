import express from "express";
import { DateTime } from "luxon";
import { ReflectionsModel } from "../../models/reflectionsModel";
import { AbstractQuestion, UserSessionReflections } from "./types";

const app = express();

const baseEndpoint = "/reflections";

/**
 * Create a new reflection
 */
app.post(`${baseEndpoint}`, async (req, res) => {
  const { userId, sessionId, reflections } = req.body;
  const newReflection = new ReflectionsModel({
    userId: userId,
    sessionId: sessionId,
    reflections: reflections,
  });
  console.log(newReflection);

  try {
    const savedReflection = await newReflection.save();
    res.json(new UserSessionReflections(savedReflection));
  } catch (err) {
    if (err) {
      console.error(err);
      res.json({ error: JSON.stringify(err) });
      return;
    }
  }
});

// /**
//  * Get a user
//  */
// app.get(`${baseEndpoint}/:id`, async (req, res) => {
//   const userID = req.params.id;
//   if (userID === undefined) {
//     console.error("id must be defined");
//   }

//   try {
//     const matchingUser = await UserModel.findById(userID);

//     if (!matchingUser) {
//       const errorMsg = `User with id: ${userID} not found`;
//       console.error(errorMsg);
//       res.json({ error: errorMsg });
//       return;
//     }
//     res.json(new User(matchingUser));
//   } catch (err) {
//     console.error(err);
//     res.json({ error: JSON.stringify(err) });
//     return;
//   }
// });

// /**
//  * Update a user
//  */
// app.put(`${baseEndpoint}/:id`, async (req, res) => {
//   const userID = req.params.id;
//   if (userID === undefined) {
//     console.error("id must be defined");
//     console.error(`User with id: ${userID} not modified`);
//   }

//   try {
//     const updatedUser = await UserModel.findByIdAndUpdate(userID, req.body);

//     res.json(new User(updatedUser));
//   } catch (err) {
//     if (err) {
//       console.error(err);
//       res.json({ error: JSON.stringify(err) });
//       return;
//     }
//   }
// });

// /**
//  * Delete a user
//  */
// app.delete(`${baseEndpoint}/:id`, async (req, res) => {
//   const userID = req.params.id;
//   if (userID === undefined) {
//     console.error("id must be defined");
//     console.error(`User with id: ${userID} not deleted`);
//   }

//   try {
//     const deletedUser = await UserModel.findOneAndDelete({ _id: userID });

//     res.json(new User(deletedUser));
//   } catch (err) {
//     console.error(err);
//     res.json({ error: JSON.stringify(err) });
//     return;
//   }
// });

export { app as reflections };
