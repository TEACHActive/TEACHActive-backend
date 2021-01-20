import { DateTime } from "luxon";

export class Session {
    id: string;
    keyword: string;
    version: string;
    schemas: string[];
    createdAt?: DateTime;
    videoFrames?: VideoFrame[];
    audioFrames?: AudioFrame[];
  
    // id: number;
    // date: moment.Moment;
    // name: string;
    // class_name: "HCI 589 - Ethics";
    // data: SessionMetric[];
  
    constructor(data: any) {
      // this.id = obj_data.id;
      // this.date = moment(obj_data.date);
      // this.name = obj_data.name;
      // this.class_name = obj_data.class_name;
      // this.data = obj_data.data.metrics.map(
      //   (metric: any) => new SessionMetric(metric)
      // );
  
      this.id = data.id;
      this.keyword = data.keyword;
      this.version = data.version;
      this.schemas = data.schemas;
      if (data.createdAt)
        this.createdAt = DateTime.fromISO(data.createdAt.RFC3339);
      if (this.videoFrames) {
        this.videoFrames = data.videoFrames.map(
          (videoFrame: any) => new VideoFrame(videoFrame)
        );
      }
      if (this.audioFrames) {
        this.audioFrames = data.audioFrames.map(
          (audioFrame: any) => new AudioFrame(audioFrame)
        );
      }
    }
  }
  
  export class VideoFrame {
    frameNumber: number;
    timestamp?: DateTime;
    thumbnail: string;
    people?: Person[];
  
    constructor(data: any) {
      this.frameNumber = data.frameNumber;
      if (data.timestamp)
        this.timestamp = DateTime.fromISO(data.timestamp.RFC3339);
      this.thumbnail = data.thumbnail;
      if (this.people)
        this.people = data.people.map((person: any) => new Person(person));
    }
  }
  
  export class AudioFrame {
    frameNumber: number;
    timestamp?: DateTime;
    channel: Channel;
    audio?: Audio;
  
    constructor(data: any) {
      this.frameNumber = data.frameNumber;
      if (data.timestamp)
        this.timestamp = DateTime.fromISO(data.timestamp.RFC3339);
      this.channel = data.channel;
      if (this.audio) this.audio = new Audio(data.audio);
    }
  }
  
  export enum Channel {
    instructor,
    student,
  }
  
  export class Person {
    body: number[];
    face: number[];
    hand: number[];
    openposeId: number;
    inference?: VideoInference;
  
    constructor(data: any) {
      this.body = data.body;
      this.face = data.face;
      this.hand = data.hand;
      this.openposeId = data.openposeId;
      if (this.inference) this.inference = new VideoInference(data.inference);
    }
  }
  
  export class VideoInference {
    posture?: Posture;
    face?: Face;
    head?: Head;
    trackingId: number;
  
    constructor(data: any) {
      if (this.posture) this.posture = new Posture(data.posture);
      if (this.face) this.face = new Face(data.face);
      if (this.head) this.head = new Head(data.head);
      this.trackingId = data.trackingId;
    }
  }
  
  export class Posture {
    armPose: ArmPose;
    sitStand: SitStand;
    centroidDelta: number[];
    armDelta: number[];
  
    constructor(data: any) {
      this.armPose = data.armPose;
      this.sitStand = data.sitStand;
      this.centroidDelta = data.centroidDelta;
      this.armDelta = data.armDelta;
    }
  }
  
  export enum ArmPose {
    handsRaised,
    armsCrossed,
    handsOnFace,
    other,
    error,
  }
  
  export enum SitStand {
    sit,
    stand,
    error,
  }
  
  export class Face {
    boundingBox: number[];
    mouthOpen: MouthOpen;
    mouthSmile: MouthSmile;
    orientation: FaceOrientation;
  
    constructor(data: any) {
      this.boundingBox = data.boundingBox;
      this.mouthOpen = data.mouthOpen;
      this.mouthSmile = data.mouthSmile;
      this.orientation = data.orientation;
    }
  }
  
  export enum MouthOpen {
    open,
    closed,
    error,
  }
  
  export enum MouthSmile {
    smile,
    noSmile,
    error,
  }
  
  export enum FaceOrientation {
    front,
    back,
    error,
  }
  
  export class Head {
    roll: number;
    pitch: number;
    yaw: number;
    translationVector: number[];
    gazeVector: number[];
  
    constructor(data: any) {
      this.roll = data.roll;
      this.pitch = data.pitch;
      this.yaw = data.yaw;
      this.translationVector = data.translationVector;
      this.gazeVector = data.gazeVector;
    }
  }
  
  export class Audio {
    amplitude: number;
    melFrequency: number[];
    inference?: AudioInference;
  
    constructor(data: any) {
      this.amplitude = data.amplitude;
      this.melFrequency = data.melFrequency;
      if (this.inference) this.inference = new AudioInference(data.inference);
    }
  }
  
  export class AudioInference {
    speech?: Speech;
  
    constructor(data: any) {
      if (this.speech) this.speech = new Speech(data.speech);
    }
  }
  
  export class Speech {
    confidence: number;
    speaker: Speaker;
  
    constructor(data: any) {
      this.confidence = data.confidence;
      this.speaker = data.speaker;
    }
  }
  
  export enum Speaker {
    ambient,
    student,
    instructor,
  }