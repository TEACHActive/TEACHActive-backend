import express from "express";
import { DateTime } from "luxon";
import { ReflectionsModel } from "../../models/reflectionsModel";

const app = express();

const baseEndpoint = "/reflections";

/**
 * Create/Update a new reflection
 */
app.put(`${baseEndpoint}/:uid/:sessionId`, async (req, res) => {
  const { uid, sessionId } = req.params;
  const { reflections } = req.body;
  if (uid === undefined) {
    console.error("id must be defined");
    res.status(400);
    res.json({
      error: "Must Provide userId",
      detail: "Must Provide userId",
    });
    return;
  }
  if (sessionId === undefined) {
    console.error("sessionId must be defined");
    res.status(400);
    res.json({
      error: "Must Provide sessionId",
      detail: "Must Provide sessionId",
    });
    return;
  }

  try {
    const matchingReflection = await ReflectionsModel.findOne({
      userId: uid,
      sessionId: sessionId,
    });

    if (!matchingReflection) {
      const newReflection = new ReflectionsModel({
        userId: uid,
        sessionId: sessionId,
        reflections: reflections,
      });
      const savedReflection = await newReflection.save();
      res.status(201);
      res.json(savedReflection);
      return;
    }

    const updatedReflection = await ReflectionsModel.updateOne(
      {
        userId: uid,
        sessionId: sessionId,
      },
      { reflections: reflections }
    );

    res.status(200);

    return;
  } catch (err) {
    console.error(err);
    res.status(500);
    res.json({
      error: "error when creating/updating reflection",
      detail: JSON.stringify(err),
    });
    return;
  }
});

/**
 * Get a reflection
 */
app.get(`${baseEndpoint}/:uid/:sessionId`, async (req, res) => {
  const { uid, sessionId } = req.params;

  if (uid === undefined) {
    console.error("id must be defined");
    res.status(400);
    res.json({
      error: "Must Provide userId",
      detail: "Must Provide userId",
    });
    return;
  }
  if (sessionId === undefined) {
    console.error("sessionId must be defined");
    res.status(400);
    res.json({
      error: "Must Provide sessionId",
      detail: "Must Provide sessionId",
    });
    return;
  }

  try {
    const matchingReflection = await ReflectionsModel.findOne({
      userId: uid,
      sessionId: sessionId,
    });

    if (!matchingReflection) {
      const errorMsg = `User with id: ${uid} and sessionId ${sessionId} not found`;
      console.error(errorMsg);
      res.status(404);
      res.json({
        error: "error when creating/updating reflection",
        detail: JSON.stringify(errorMsg),
      });
      return;
    }
    res.status(200);
    res.json(matchingReflection);
  } catch (err) {
    console.error(err);
    res.status(500);
    res.json({ error: JSON.stringify(err) });
    return;
  }
});

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
