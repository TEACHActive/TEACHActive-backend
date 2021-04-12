"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Speaker = exports.Speech = exports.AudioInference = exports.Audio = exports.Head = exports.FaceOrientation = exports.MouthSmile = exports.MouthOpen = exports.Face = exports.SitStand = exports.ArmPose = exports.Posture = exports.VideoInference = exports.Person = exports.Channel = exports.AudioFrame = exports.VideoFrame = exports.Session = void 0;
var luxon_1 = require("luxon");
var Session = /** @class */ (function () {
    // id: number;
    // date: moment.Moment;
    // name: string;
    // class_name: "HCI 589 - Ethics";
    // data: SessionMetric[];
    function Session(data) {
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
            this.createdAt = luxon_1.DateTime.fromISO(data.createdAt.RFC3339);
        if (data.videoFrames) {
            this.videoFrames = data.videoFrames.map(function (videoFrame) { return new VideoFrame(videoFrame); });
        }
        if (data.audioFrames) {
            this.audioFrames = data.audioFrames.map(function (audioFrame) { return new AudioFrame(audioFrame); });
        }
    }
    return Session;
}());
exports.Session = Session;
var VideoFrame = /** @class */ (function () {
    function VideoFrame(data) {
        this.frameNumber = data.frameNumber;
        if (data.timestamp)
            this.timestamp = luxon_1.DateTime.fromISO(data.timestamp);
        this.thumbnail = data.thumbnail;
        if (data.people)
            this.people = data.people.map(function (person) { return new Person(person); });
        this.channel = data.channel;
    }
    VideoFrame.prototype.toClient = function () {
        return {
            frameNumber: this.frameNumber,
            timestamp: this.timestamp,
            people: this.people,
            channel: this.channel,
        };
    };
    return VideoFrame;
}());
exports.VideoFrame = VideoFrame;
var AudioFrame = /** @class */ (function () {
    function AudioFrame(data) {
        this.frameNumber = data.frameNumber;
        if (data.timestamp)
            this.timestamp = luxon_1.DateTime.fromISO(data.timestamp.RFC3339);
        this.channel = data.channel;
        if (data.audio)
            this.audio = new Audio(data.audio);
    }
    return AudioFrame;
}());
exports.AudioFrame = AudioFrame;
var Channel;
(function (Channel) {
    Channel[Channel["instructor"] = 0] = "instructor";
    Channel[Channel["student"] = 1] = "student";
})(Channel = exports.Channel || (exports.Channel = {}));
var Person = /** @class */ (function () {
    function Person(data) {
        this.body = data.body;
        this.face = data.face;
        this.hand = data.hand;
        this.openposeId = data.openposeId;
        if (data.inference)
            this.inference = new VideoInference(data.inference);
    }
    return Person;
}());
exports.Person = Person;
var VideoInference = /** @class */ (function () {
    function VideoInference(data) {
        if (data.posture)
            this.posture = new Posture(data.posture);
        if (data.face)
            this.face = new Face(data.face);
        if (data.head)
            this.head = new Head(data.head);
        this.trackingId = data.trackingId;
    }
    return VideoInference;
}());
exports.VideoInference = VideoInference;
var Posture = /** @class */ (function () {
    function Posture(data) {
        this.armPose = data.armPose;
        this.sitStand = data.sitStand;
        this.centroidDelta = data.centroidDelta;
        this.armDelta = data.armDelta;
    }
    return Posture;
}());
exports.Posture = Posture;
var ArmPose;
(function (ArmPose) {
    ArmPose[ArmPose["handsRaised"] = 0] = "handsRaised";
    ArmPose[ArmPose["armsCrossed"] = 1] = "armsCrossed";
    ArmPose[ArmPose["handsOnFace"] = 2] = "handsOnFace";
    ArmPose[ArmPose["other"] = 3] = "other";
    ArmPose[ArmPose["error"] = 4] = "error";
})(ArmPose = exports.ArmPose || (exports.ArmPose = {}));
var SitStand;
(function (SitStand) {
    SitStand[SitStand["sit"] = 0] = "sit";
    SitStand[SitStand["stand"] = 1] = "stand";
    SitStand[SitStand["error"] = 2] = "error";
})(SitStand = exports.SitStand || (exports.SitStand = {}));
var Face = /** @class */ (function () {
    function Face(data) {
        this.boundingBox = data.boundingBox;
        this.mouthOpen = data.mouthOpen;
        this.mouthSmile = data.mouthSmile;
        this.orientation = data.orientation;
    }
    return Face;
}());
exports.Face = Face;
var MouthOpen;
(function (MouthOpen) {
    MouthOpen[MouthOpen["open"] = 0] = "open";
    MouthOpen[MouthOpen["closed"] = 1] = "closed";
    MouthOpen[MouthOpen["error"] = 2] = "error";
})(MouthOpen = exports.MouthOpen || (exports.MouthOpen = {}));
var MouthSmile;
(function (MouthSmile) {
    MouthSmile[MouthSmile["smile"] = 0] = "smile";
    MouthSmile[MouthSmile["noSmile"] = 1] = "noSmile";
    MouthSmile[MouthSmile["error"] = 2] = "error";
})(MouthSmile = exports.MouthSmile || (exports.MouthSmile = {}));
var FaceOrientation;
(function (FaceOrientation) {
    FaceOrientation[FaceOrientation["front"] = 0] = "front";
    FaceOrientation[FaceOrientation["back"] = 1] = "back";
    FaceOrientation[FaceOrientation["error"] = 2] = "error";
})(FaceOrientation = exports.FaceOrientation || (exports.FaceOrientation = {}));
var Head = /** @class */ (function () {
    function Head(data) {
        this.roll = data.roll;
        this.pitch = data.pitch;
        this.yaw = data.yaw;
        this.translationVector = data.translationVector;
        this.gazeVector = data.gazeVector;
    }
    return Head;
}());
exports.Head = Head;
var Audio = /** @class */ (function () {
    function Audio(data) {
        this.amplitude = data.amplitude;
        this.melFrequency = data.melFrequency;
        if (data.inference)
            this.inference = new AudioInference(data.inference);
    }
    return Audio;
}());
exports.Audio = Audio;
var AudioInference = /** @class */ (function () {
    function AudioInference(data) {
        if (data.speech)
            this.speech = new Speech(data.speech);
    }
    return AudioInference;
}());
exports.AudioInference = AudioInference;
var Speech = /** @class */ (function () {
    function Speech(data) {
        this.confidence = data.confidence;
        this.speaker = data.speaker;
    }
    return Speech;
}());
exports.Speech = Speech;
var Speaker;
(function (Speaker) {
    Speaker[Speaker["ambient"] = 0] = "ambient";
    Speaker[Speaker["student"] = 1] = "student";
    Speaker[Speaker["instructor"] = 2] = "instructor";
})(Speaker = exports.Speaker || (exports.Speaker = {}));
