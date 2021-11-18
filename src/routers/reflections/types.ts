export class ReflectionSection {
  data: any;
  constructor(data: any) {
    this.data = data;
  }
}

export class Reflection {
  id: string;
  userId: string;
  sessionId: string;
  reflectionSections: ReflectionSection;

  constructor(data: any) {
    this.id = data.id;
    this.userId = data.userId;
    this.sessionId = data.sessionId;
    this.reflectionSections = data.reflectionSections.map(
      (section: any) => new ReflectionSection(section)
    );
  }
}
