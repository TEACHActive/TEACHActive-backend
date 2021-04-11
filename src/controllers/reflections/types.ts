import { DateTime } from "luxon";

export class UserSessionReflections {
  userId: string;
  sessionId: string;
  reflections: AbstractQuestion[];

  constructor(data: any) {
    this.userId = data.userId;
    this.sessionId = data.sessionId;
    this.reflections = data.reflections.map(
      (reflection: any) => new AbstractQuestion(reflection)
    );
  }
}

export class AbstractQuestion {
  id: string;
  prompt: string;
  // dateAnswered: DateTime;

  constructor(data: any) {
    this.id = data._id || data.id;
    this.prompt = data.prompt;
    // this.dateAnswered = data.dateAnswered;
  }
}

export class YNQuestion extends AbstractQuestion {
  yes: string;
  no: string;
  onYes: AbstractQuestion;
  onNo: AbstractQuestion;

  constructor(data: any) {
    super(data);
    this.yes = data.yes;
    this.no = data.no;
    this.onYes = data.onYes;
    this.onNo = data.onNo;
  }
}

export class MultiChoiceQuestion extends AbstractQuestion {
  options: ChoiceQuestionOption[];
  hasOther: boolean;
  otherValue: ChoiceQuestionOption;

  constructor(data: any) {
    super(data);
    this.options = data.options;
    this.hasOther = data.hasOther;
    this.otherValue = data.otherValue;
  }
}

export class SingleChoiceQuestion extends AbstractQuestion {
  options: ChoiceQuestionOption[];
  hasOther: boolean;
  otherValue: ChoiceQuestionOption;

  constructor(data: any) {
    super(data);
    this.options = data.options;
    this.hasOther = data.hasOther;
    this.otherValue = data.otherValue;
  }
}

class ChoiceQuestionOption {
  value: string;
  selected: boolean;

  constructor(data: any) {
    this.value = data.value;
    this.selected = data.selected;
  }
}
