import {
  ReflectionQuestion,
  ReflectionSection,
} from "../../models/reflectionsModel";

//=======================================================================
//=======================================================================

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
  otherValue: string = "",
  otherSelected: boolean = false
) => {
  return {
    options: options.map((option) => {
      return { ...option, value: option.label };
    }),
    hasOther: hasOther,
    otherValue: otherValue,
    otherSelected: otherSelected,
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
  otherValue: string = "",
  otherSelected: boolean = false
) => {
  return {
    options: options.map((option) => {
      return { ...option, label: option.value };
    }),
    hasOther: hasOther,
    otherValue: otherValue,
    otherSelected: otherSelected,
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

//=======================================================================
//=======================================================================

let currentPriority = 9999999;
let getCurrentPriority = () => --currentPriority;

let currentId = 0;
let getCurrentId = () => currentId++;

//=======================================================================
//=======================================================================

const constructQuestion = (
  incomingQuestionOverrides: any,
  id: number = getCurrentId(),
  priority: number = getCurrentPriority()
): ReflectionQuestion => {
  const defaultReflectionQuestion: ReflectionQuestion = {
    id: `q${id}`,
    value: "",
    priority: priority,
    selected: true,
    required: true,
    placeholder: "",
    onSelected: {
      prompt: "",
      questionType: "",
      ynQuestion: null,
      multiChoiceQuestion: null,
      singleChoiceQuestion: null,
      freeResponseQuestion: null,
      likertQuestion: null,
    },
  };
  let newQuestion = {
    ...defaultReflectionQuestion,
    onSelected: {
      ...defaultReflectionQuestion.onSelected,
      ...incomingQuestionOverrides,
    },
  };
  return newQuestion;
};

//=======================================================================
//=======================================================================

export const baseReflectionSections: ReflectionSection[] = [
  {
    name: "handRaises",
    title: "Hand Raises",
    questions: [
      constructQuestion({
        questionType: "multiChoiceQuestion",
        prompt: "Students mainly raised their hands during this session to",
        multiChoiceQuestion: MultiChoiceQuestion(
          [
            { label: "Ask questions/clarifications", selected: false },
            { label: "Participate in-class discussions", selected: false },
          ],
          true,
          "",
          false
        ),
      }),
      constructQuestion({
        questionType: "ynQuestion",
        prompt: "Are you satisfied with students’ number of hand raises",
        ynQuestion: YNQuestion(),
      }),
      constructQuestion({
        questionType: "ynQuestion",
        prompt: "Would you like to set a goal for next session?",
        ynQuestion: YNQuestion(),
      }),
      constructQuestion({
        questionType: "multiChoiceQuestion",
        prompt: "What goal would you like to set for the next session?",
        multiChoiceQuestion: MultiChoiceQuestion(
          [
            {
              label: "Trigger more student discussions to increase hand raises",
              selected: false,
            },
          ],
          true,
          "",
          false
        ),
      }),
      constructQuestion({
        questionType: "ynQuestion",
        prompt:
          "Is this metric descriptive/ indicative of what’s happening during class time",
        ynQuestion: YNQuestion(),
      }),
    ],
  },
  {
    name: "sitVSStand",
    title: "Sit vs Stand",
    questions: [],
  },
  {
    name: "instructorMovement",
    title: "Instructor Movement",
    questions: [],
  },
  {
    name: "behavioralEngagement",
    title: "Behavioral Engagement",
    questions: [],
  },
  {
    name: "instructorSpeech",
    title: "Instructor Speech",
    questions: [
      constructQuestion({
        questionType: "ynQuestion",
        prompt: "Did you expect that you will be speaking for this time?",
        ynQuestion: YNQuestion(),
      }),
      constructQuestion({
        questionType: "multiChoiceQuestion",
        prompt: "Your talking was mainly",
        multiChoiceQuestion: MultiChoiceQuestion(
          [
            {
              label: "Lecture",
              selected: false,
            },
            {
              label: "Explaining new concepts",
              selected: false,
            },
            {
              label: "Answering Questions/ Clarifying",
              selected: false,
            },
          ],
          false
        ),
      }),
      constructQuestion({
        questionType: "ynQuestion",
        prompt: "Are you satisfied with the number of minutes you spoke",
        ynQuestion: YNQuestion(),
      }),
      constructQuestion({
        questionType: "ynQuestion",
        prompt: "Would you like to set a goal for next session?",
        ynQuestion: YNQuestion(),
      }),
      constructQuestion({
        questionType: "ynQuestion",
        prompt:
          "Is this metric indicative/ descriptive of facilitating strategies in class?",
        ynQuestion: YNQuestion(),
      }),
    ],
  },
  {
    name: "studentSpeech",
    title: "Student Speech",
    questions: [
      constructQuestion({
        questionType: "ynQuestion",
        prompt: "Did you expect that they will be speaking for this time?",
        ynQuestion: YNQuestion(),
      }),
      constructQuestion({
        questionType: "multiChoiceQuestion",
        prompt: "Your talking was mainly",
        multiChoiceQuestion: MultiChoiceQuestion(
          [
            {
              label: "Asking questions",
              selected: false,
            },
            {
              label: "Participating",
              selected: false,
            },
            {
              label: "Discussing with others",
              selected: false,
            },
          ],
          true,
          "",
          false
        ),
      }),
      constructQuestion({
        questionType: "ynQuestion",
        prompt: "Are you satisfied with the number of minutes they spoke",
        ynQuestion: YNQuestion(),
      }),
      constructQuestion({
        questionType: "ynQuestion",
        prompt: "Would you like to set a goal for next session?",
        ynQuestion: YNQuestion(),
      }),
    ],
  },
];
