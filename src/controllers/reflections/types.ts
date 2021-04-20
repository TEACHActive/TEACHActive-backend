import { DateTime } from "luxon";

// export class UserSessionReflections {
//   userId: string;
//   sessionId: string;
//   reflections: AbstractQuestion[];

//   constructor(data: any) {
//     this.userId = data.userId;
//     this.sessionId = data.sessionId;
//     this.reflections = data.reflections.map((reflection: any) => {
//       switch (reflection.questionType) {
//         case QuestionType.YNQuestion:
//           return new YNQuestion(reflection);
//         case QuestionType.MultiChoiceQuestion:
//           return new MultiChoiceQuestion(reflection);
//         case QuestionType.SingleChoiceQuestion:
//           return new SingleChoiceQuestion(reflection);
//         default:
//           return null;
//       }
//     });
//   }
//   toClient = (): { userId: string; sessionId: string; reflections: any[] } => {
//     return {
//       userId: this.userId,
//       sessionId: this.sessionId,
//       reflections: this.reflections.map((reflection) => {
//         switch (reflection.questionType) {
//           case QuestionType.YNQuestion:
//             return new YNQuestion(reflection).toClient();
//           case QuestionType.MultiChoiceQuestion:
//             return new MultiChoiceQuestion(reflection).toClient();
//           case QuestionType.SingleChoiceQuestion:
//             return new SingleChoiceQuestion(reflection).toClient();
//           default:
//             break;
//         }
//       }),
//     };
//   };
// }

// export abstract class AbstractQuestion {
//   id: string;
//   prompt: string;
//   questionType: QuestionType;
//   // dateAnswered: DateTime;

//   constructor(data: any) {
//     this.id = data._id || data.id;
//     this.prompt = data.prompt;
//     // this.dateAnswered = data.dateAnswered;
//     this.questionType = data.questionType;
//   }
// }

// export class YNQuestion extends AbstractQuestion {
//   yes: string;
//   no: string;
//   onYes: AbstractQuestion;
//   onNo: AbstractQuestion;

//   constructor(data: any) {
//     super(data);
//     // console.log(data);
//     this.yes = data.yes;
//     this.no = data.no;
//     this.onYes = data.onYes;
//     this.onNo = data.onNo;
//   }

//   toClient = () => {
//     return {
//       id: this.id,
//       prompt: this.prompt,
//       questionType: this.questionType,
//       yes: this.yes,
//       no: this.no,
//       onYes: this.onYes, //Todo
//       onNo: this.onNo, //Todo
//     };
//   };
// }

// export class MultiChoiceQuestion extends AbstractQuestion {
//   options: ChoiceQuestionOption[];
//   hasOther: boolean;
//   otherValue: ChoiceQuestionOption;

//   constructor(data: any) {
//     super(data);
//     this.options = data.options;
//     this.hasOther = data.hasOther;
//     this.otherValue = data.otherValue;
//   }

//   toClient = () => {
//     return {
//       id: this.id,
//       prompt: this.prompt,
//       questionType: this.questionType,
//       options: this.options.map((option) => option.toClient()),
//       hasOther: this.hasOther,
//       otherValue: this.otherValue.toClient(),
//     };
//   };
// }

// export class SingleChoiceQuestion extends AbstractQuestion {
//   options: ChoiceQuestionOption[];
//   hasOther: boolean;
//   otherValue: ChoiceQuestionOption;

//   constructor(data: any) {
//     super(data);
//     this.options = data.options;
//     this.hasOther = data.hasOther;
//     this.otherValue = data.otherValue;
//   }

//   toClient = () => {
//     return {
//       id: this.id,
//       prompt: this.prompt,
//       questionType: this.questionType,
//       options: this.options.map((option) => option.toClient()),
//       hasOther: this.hasOther,
//       otherValue: this.otherValue.toClient(),
//     };
//   };
// }

// class ChoiceQuestionOption {
//   value: string;
//   selected: boolean;

//   constructor(data: any) {
//     this.value = data.value;
//     this.selected = data.selected;
//   }

//   toClient = () => {
//     return {
//       value: this.value,
//       selected: this.selected,
//     };
//   };
// }

// export enum QuestionType {
//   YNQuestion = "ynQuestion",
//   MultiChoiceQuestion = "multiChoiceQuestion",
//   SingleChoiceQuestion = "singleChoiceQuestion",
// }
