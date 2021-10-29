import express from "express";
import {
  Better_ReflectionsModel,
  ReflectionSection,
  ReflectionQuestion,
} from "../../models/reflectionsModel";
import { baseReflectionSections } from "./baseReflectionSections";

const app = express();

const baseEndpoint = "/reflections";

/**
 * Update a new reflection
 */
app.put(`${baseEndpoint}/:uid/:sessionId`, async (req, res) => {
  console.log("Update a new reflection");
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
    // {
    //   _id: 61698a700a7a734fa9b54777,
    //   userId: 'JxEDspL0SYQhXjfPDXhMaZRZAux1',
    //   sessionId: '60913c2f4f34c900012e80cf',
    //   reflectionSections: [
    //     {
    //       _id: 61698a700a7a734fa9b54778,
    //       name: 'handRaises',
    //       title: 'Hand Raises',
    //       questions: [Array]
    //     }
    //   ],
    //   __v: 0
    // }

    let updatedReflectionSections: ReflectionSection[] = [
      ...baseReflectionSections,
    ].map((section) => {
      const updatedQuestions = section.questions.map((reflectionQuestion) => {
        const updatingR: ReflectionQuestion = req.body.find(
          (incomingReflection: ReflectionQuestion) =>
            incomingReflection.id === reflectionQuestion.id
        );
        return updatingR ?? reflectionQuestion;
      });
      section.questions = updatedQuestions;
      return section;
    });

    const matchingReflection = await Better_ReflectionsModel.findOne({
      userId: uid,
      sessionId: sessionId,
    });

    if (!matchingReflection) {
      res.status(404);
      res.json({ error: "Matching reflection doc not found" });
      return;
    }

    matchingReflection.reflectionSections = updatedReflectionSections;

    const updatedReflection = await Better_ReflectionsModel.findOneAndUpdate(
      {
        userId: uid,
        sessionId: sessionId,
      },
      {
        $set: {
          reflectionSections: updatedReflectionSections,
        },
      },
      { new: true },
      (err, doc, raw) => {
        console.log(err);

        // if (err) {
        //   //Try creating a new one since it presumable cant be found
        // }
      }
    );

    res.status(200);
    res.json(updatedReflection);

    return;
  } catch (err) {
    console.error(err);
    res.status(500);
    res.json({
      error: "error when updating reflection",
      detail: JSON.stringify(err),
    });
    return;
  }
});

/**
 * Create reflections
 */
app.post(`${baseEndpoint}/:uid/:sessionId`, async (req, res) => {
  console.log("Create a new reflection");
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

  const newReflection = new Better_ReflectionsModel({
    userId: uid,
    sessionId: sessionId,
    reflectionSections: baseReflectionSections,
  });

  const savedReflection = await newReflection.save();
  res.status(201);
  res.json(savedReflection);
  return;
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
    const matchingReflection = await Better_ReflectionsModel.findOne({
      userId: uid,
      sessionId: sessionId,
    });

    if (!matchingReflection) {
      const errorMsg = `Doc matching user with id: ${uid} and sessionId ${sessionId} not found`;
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

/**
 * Delete reflections
 */
app.delete(`${baseEndpoint}/:uid/:sessionId`, async (req, res) => {
  //Todo: test this
  const { uid, sessionId } = req.params;

  const matchingReflection = Better_ReflectionsModel.findOneAndDelete(
    {
      userId: uid,
      sessionId: sessionId,
    },
    { new: true }
  );

  console.log(matchingReflection);
});

export { app as reflections };
