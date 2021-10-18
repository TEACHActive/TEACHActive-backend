import express from "express";
import { DateTime } from "luxon";
import {
  Better_ReflectionSectionSchema,
  Better_ReflectionsModel,
  HandRaisesReflectionModel,
  ReflectionsModel,
  ReflectionDoc,
  ReflectionSection,
  ReflectionQuestion,
} from "../../models/reflectionsModel";

import * as Constants from "../../constants";

const app = express();

const baseEndpoint = "/reflections";

const YNQuestion = () => {
  return {
    yes: {
      value: "",
      label: "",
      selected: false,
    },
    no: {
      value: "",
      label: "",
      selected: true,
    },
  };
};
const DefaultYNQuestion = YNQuestion();

const MultiChoiceQuestion = (
  options: {
    label: string;
    selected: boolean;
  }[],
  hasOther: boolean = false,
  otherValue: string = ""
) => {
  return {
    options: options.map((option) => {
      return { ...option, value: option.label };
    }),
    hasOther: hasOther,
    otherValue: otherValue,
  };
};
const DefaultMultiChoiceQuestion = MultiChoiceQuestion(
  [
    { label: "A", selected: false },
    { label: "B", selected: true },
    { label: "C", selected: false },
  ],
  true,
  "Test Extra"
);

const SingleChoiceQuestion = (
  options: {
    value: string;
    selected: boolean;
  }[],
  hasOther: boolean = false,
  otherValue: string = ""
) => {
  return {
    options: options.map((option) => {
      return { ...option, label: option.value };
    }),
    hasOther: hasOther,
    otherValue: otherValue,
  };
};
const DefaultSingleChoiceQuestion = SingleChoiceQuestion(
  [
    { value: "Value A", selected: false },
    { value: "Value B", selected: true },
  ],
  true,
  "otherValue"
);

const FreeResponseQuestion = (value: string) => {
  return {
    feild: value,
  };
};
const DefaultFreeResponseQuestion = FreeResponseQuestion("This is a test");

console.log(55, DefaultFreeResponseQuestion);

const LikertQuestion = (
  minValue: number = 1,
  maxValue: number = 5,
  value: number = 1,
  isSet: boolean = false
) => {
  return {
    value: value,
    minValue: minValue,
    maxValue: maxValue,
    isSet: isSet,
  };
};
const DefaultLikertQuestion = LikertQuestion();

const baseReflectionSections: ReflectionSection[] = [
  {
    name: "handRaises",
    title: "Hand Raises",
    questions: [
      {
        id: "q0",
        value: "",
        priority: 1,
        selected: true,
        required: true,
        placeholder: "",
        onSelected: {
          prompt: "This is a prompt",
          questionType: "singleChoiceQuestion",
          ynQuestion: null,
          multiChoiceQuestion: null,
          singleChoiceQuestion: DefaultSingleChoiceQuestion,
          freeResponseQuestion: null,
          likertQuestion: null,
        },
      },
      {
        id: "q1",
        value: "",
        priority: 0,
        selected: true,
        required: true,
        placeholder: "Placeholder",
        onSelected: {
          prompt: "This is a prompt (y/n)",
          questionType: "ynQuestion",
          ynQuestion: DefaultYNQuestion,
          multiChoiceQuestion: null,
          singleChoiceQuestion: null,
          freeResponseQuestion: null,
          likertQuestion: null,
        },
      },
      {
        id: "q2",
        value: "",
        priority: 0,
        selected: true,
        required: true,
        placeholder: "Placeholder",
        onSelected: {
          prompt: "This is a prompt (multiChoiceQuestion)",
          questionType: "multiChoiceQuestion",
          ynQuestion: null,
          multiChoiceQuestion: DefaultMultiChoiceQuestion,
          singleChoiceQuestion: null,
          freeResponseQuestion: null,
          likertQuestion: null,
        },
      },
      {
        id: "q3",
        value: "",
        priority: 0,
        selected: true,
        required: true,
        placeholder: "Placeholder",
        onSelected: {
          prompt: "This is a prompt (freeResponseQuestion)",
          questionType: "freeResponseQuestion",
          ynQuestion: null,
          multiChoiceQuestion: null,
          singleChoiceQuestion: null,
          freeResponseQuestion: { feild: "Testing 23" },
          likertQuestion: null,
        },
      },
      {
        id: "q4",
        value: "",
        priority: 0,
        selected: true,
        required: true,
        placeholder: "Placeholder",
        onSelected: {
          prompt: "This is a prompt (likertQuestion)",
          questionType: "likertQuestion",
          ynQuestion: null,
          multiChoiceQuestion: null,
          singleChoiceQuestion: null,
          freeResponseQuestion: null,
          likertQuestion: DefaultLikertQuestion,
        },
      },
      {
        id: "q5",
        value: "",
        priority: 0,
        selected: true,
        required: true,
        placeholder: "Placeholder",
        onSelected: {
          prompt: "This is a prompt (likertQuestion)",
          questionType: "likertQuestion",
          ynQuestion: null,
          multiChoiceQuestion: null,
          singleChoiceQuestion: null,
          freeResponseQuestion: null,
          likertQuestion: LikertQuestion(1, 10, 3),
        },
      },
    ],
  },
  // {
  //   name: "studentSpeech",
  //   title: "Student Speech",
  //   questions: [],
  // },
  // {
  //   name: "instructorSpeech",
  //   title: "Instructor Speech",
  //   questions: [],
  // },
];

/**
 * Create/Update a new reflection
 */
app.put(`${baseEndpoint}/:uid/:sessionId`, async (req, res) => {
  console.log("Create/Update a new reflection");
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
    console.log(1, {
      userId: uid,
      sessionId: sessionId,
    });

    const matchingReflection = await Better_ReflectionsModel.findOne({
      userId: uid,
      sessionId: sessionId,
    });
    console.log(2, matchingReflection);

    if (!matchingReflection) {
      res.status(404);
      res.json({ error: "Matching reflection doc not found" });
      return;
    }

    console.log(3, updatedReflectionSections);

    matchingReflection.reflectionSections = updatedReflectionSections;
    console.log(4, matchingReflection);

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
        console.log("doc");
        console.log(doc);
        console.log(raw);
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
    console.log(matchingReflection);

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
