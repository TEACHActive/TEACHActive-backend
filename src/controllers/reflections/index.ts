import express from "express";
import { DateTime } from "luxon";
import {
  Better_ReflectionSectionSchema,
  Better_ReflectionsModel,
  HandRaisesReflectionModel,
  ReflectionsModel,
} from "../../models/reflectionsModel";

import * as Constants from "../../constants";

const app = express();

const baseEndpoint = "/reflections";

const YNQuestion = (yes: string, no: string) => {
  return {
    yes: {
      value: "",
      label: yes,
      selected: false,
    },
    no: {
      value: "",
      label: no,
      selected: false,
    },
  };
};
const DefaultYNQuestion = YNQuestion("", "");

const MultiChoiceQuestion = (
  options: {
    value: string;
    label: string;
    selected: boolean;
  }[],
  hasOther: boolean = false,
  otherValue: string = ""
) => {
  return {
    options: options,
    hasOther: hasOther,
    otherValue: otherValue,
  };
};
const DefaultMultiChoiceQuestion = MultiChoiceQuestion(
  [{ value: "", label: "", selected: false }],
  false,
  ""
);

const SingleChoiceQuestion = (
  options: {
    value: string;
    label: string;
    selected: boolean;
  }[],
  hasOther: boolean = false,
  otherValue: string = ""
) => {
  return {
    options: options,
    hasOther: hasOther,
    otherValue: otherValue,
  };
};
const DefaultSingleChoiceQuestion = SingleChoiceQuestion(
  [{ value: "", label: "", selected: false }],
  false,
  ""
);

const FreeResponseQuestion = (label: string, value: string) => {
  return {
    value: value,
    label: label,
    selected: false,
  };
};
const DefaultFreeResponseQuestion = FreeResponseQuestion("", "");

const LikertQuestion = (
  minValue: number = 1,
  maxValue: number = 5,
  value: number = 1,
  isSet: boolean = false
) => {
  return {
    value: 1,
    minValue: 1,
    maxValue: 5,
    isSet: false,
  };
};
const DefaultLikertQuestion = LikertQuestion();

const baseReflectionSections = [
  {
    name: "handRaises",
    title: "Hand Raises",
    questions: [
      {
        value: "",
        priority: 0,
        selected: true,
        onSelected: {
          prompt: "This is a prompt",
          questionType: "singleChoiceQuestion",
          ynQuestion: DefaultYNQuestion,
          multiChoiceQuestion: DefaultMultiChoiceQuestion,
          singleChoiceQuestion: DefaultSingleChoiceQuestion,
          freeResponseQuestion: DefaultFreeResponseQuestion,
          likertQuestion: DefaultLikertQuestion,
        },
      },
    ],
  },
  {
    name: "studentSpeech",
    title: "Student Speech",
    questions: [],
  },
  {
    name: "instructorSpeech",
    title: "Instructor Speech",
    questions: [],
  },
];

/**
 * Create/Update a new reflection
 */
app.put(`${baseEndpoint}/:uid/:sessionId`, async (req, res) => {
  console.log("Create/Update a new reflection");
  const { uid, sessionId } = req.params;
  let reflections = baseReflectionSections;
  //Update reflections as necessary
  if (req.params.reflections && Array.isArray(req.params.reflections)) {
    req.params.reflections.forEach((incomingReflection) => {
      console.log(incomingReflection);
    });
  }
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
      const newReflection = new Better_ReflectionsModel({
        userId: uid,
        sessionId: sessionId,
        reflections: reflections,
      });
      const savedReflection = await newReflection.save();
      res.status(201);
      res.json(savedReflection);
      return;
    }

    const updatedReflection = await Better_ReflectionsModel.findOneAndUpdate(
      {
        userId: uid,
        sessionId: sessionId,
      },
      { reflectionSections: reflections },
      { upsert: true, new: true }
    );

    res.status(200);
    res.json(updatedReflection);
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
    const matchingReflection = await Better_ReflectionsModel.findOne({
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

//=================================================================================================
//=================================================================================================

/**
 * Create HandRaises template reflection
 */
app.post(`${baseEndpoint}/handRaises/:uid/:sessionId`, async (req, res) => {
  const { uid, sessionId } = req.params;
  const {
    handRaisesReasonOptions,
    handRaiseReasonOther,
    satisifedWithHandRaisesValue,
    reasonDissatisfiedWithHandRaises,
    goalNextSessionValue,
    handRaiseGoalOptions,
    handRaiseGoalOther,
  } = req.body;

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
    const result = await HandRaisesReflectionModel.findOneAndUpdate(
      {
        userId: uid,
        sessionId: sessionId,
      },
      {
        userId: uid,
        sessionId: sessionId,
        handRaisesReasonOptions: handRaisesReasonOptions,
        handRaiseReasonOther: handRaiseReasonOther,
        satisifedWithHandRaisesValue: satisifedWithHandRaisesValue,
        reasonDissatisfiedWithHandRaises: reasonDissatisfiedWithHandRaises,
        goalNextSessionValue: goalNextSessionValue,
        handRaiseGoalOptions: handRaiseGoalOptions,
        handRaiseGoalOther: handRaiseGoalOther,
      },
      { upsert: true }
    );

    res.status(201);
    res.json(result);
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

const DefaultHandRaiseGoalOptions = {
  handRaisesReasonOptions: [
    {
      label: "Ask questions/clarifications",
      value: "questions_clarifications",
      disabled: false,
      checked: false,
    },
    {
      label: "Participate in-class discussions",
      value: "participate_discussions",
      disabled: false,
      checked: false,
    },
    {
      label: "Other",
      value: "other",
      disabled: false,
      checked: false,
    },
  ],
  handRaiseReasonOther: "",
  satisifedWithHandRaisesValue: "",
  reasonDissatisfiedWithHandRaises: "",
  goalNextSessionValue: "",
  handRaiseGoalOptions: [
    {
      label: "Trigger more student discussions to increase hand raises",
      value: "more_student_discussions",
      disabled: false,
      checked: false,
    },
    {
      label: "Other",
      value: "other",
      disabled: false,
      checked: false,
    },
  ],
  handRaiseGoalOther: "",
};

/**
 * Get HandRaises template reflection
 */
app.get(`${baseEndpoint}/handRaises/:uid/:sessionId`, async (req, res) => {
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
    let matchingReflection;
    if (Constants.ADMIN_LIST.includes(uid)) {
      //User making request is an admin, only match on sessionID
      matchingReflection = await HandRaisesReflectionModel.findOne({
        sessionId: sessionId,
      });
    } else {
      //User making request is not an admin
      matchingReflection = await HandRaisesReflectionModel.findOne({
        userId: uid,
        sessionId: sessionId,
      });
    }
    // console.log(matchingReflection);

    if (!matchingReflection) {
      const newReflection = new HandRaisesReflectionModel({
        userId: uid,
        sessionId: sessionId,
        handRaisesReasonOptions:
          DefaultHandRaiseGoalOptions.handRaisesReasonOptions,
        handRaiseReasonOther: DefaultHandRaiseGoalOptions.handRaiseReasonOther,
        satisifedWithHandRaisesValue:
          DefaultHandRaiseGoalOptions.satisifedWithHandRaisesValue,
        reasonDissatisfiedWithHandRaises:
          DefaultHandRaiseGoalOptions.reasonDissatisfiedWithHandRaises,
        goalNextSessionValue: DefaultHandRaiseGoalOptions.goalNextSessionValue,
        handRaiseGoalOptions: DefaultHandRaiseGoalOptions.handRaiseGoalOptions,
        handRaiseGoalOther: DefaultHandRaiseGoalOptions.handRaiseGoalOther,
      });
      const savedReflection = await newReflection.save();
      res.json(savedReflection);
      return;

      // const errorMsg = `User with id: ${uid} and sessionId ${sessionId} not found`;
      // console.error(errorMsg);
      // res.status(404);
      // res.json({
      //   error: "could not find matching hand raises reflection",
      //   detail: JSON.stringify(errorMsg),
      // });
      // return;
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
