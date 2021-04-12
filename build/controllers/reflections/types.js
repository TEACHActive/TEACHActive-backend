"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.SingleChoiceQuestion = exports.MultiChoiceQuestion = exports.YNQuestion = exports.AbstractQuestion = exports.UserSessionReflections = void 0;
var UserSessionReflections = /** @class */ (function () {
    function UserSessionReflections(data) {
        this.userId = data.userId;
        this.sessionId = data.sessionId;
        this.reflections = data.reflections.map(function (reflection) { return new AbstractQuestion(reflection); });
    }
    return UserSessionReflections;
}());
exports.UserSessionReflections = UserSessionReflections;
var AbstractQuestion = /** @class */ (function () {
    // dateAnswered: DateTime;
    function AbstractQuestion(data) {
        this.id = data._id || data.id;
        this.prompt = data.prompt;
        // this.dateAnswered = data.dateAnswered;
    }
    return AbstractQuestion;
}());
exports.AbstractQuestion = AbstractQuestion;
var YNQuestion = /** @class */ (function (_super) {
    __extends(YNQuestion, _super);
    function YNQuestion(data) {
        var _this = _super.call(this, data) || this;
        _this.yes = data.yes;
        _this.no = data.no;
        _this.onYes = data.onYes;
        _this.onNo = data.onNo;
        return _this;
    }
    return YNQuestion;
}(AbstractQuestion));
exports.YNQuestion = YNQuestion;
var MultiChoiceQuestion = /** @class */ (function (_super) {
    __extends(MultiChoiceQuestion, _super);
    function MultiChoiceQuestion(data) {
        var _this = _super.call(this, data) || this;
        _this.options = data.options;
        _this.hasOther = data.hasOther;
        _this.otherValue = data.otherValue;
        return _this;
    }
    return MultiChoiceQuestion;
}(AbstractQuestion));
exports.MultiChoiceQuestion = MultiChoiceQuestion;
var SingleChoiceQuestion = /** @class */ (function (_super) {
    __extends(SingleChoiceQuestion, _super);
    function SingleChoiceQuestion(data) {
        var _this = _super.call(this, data) || this;
        _this.options = data.options;
        _this.hasOther = data.hasOther;
        _this.otherValue = data.otherValue;
        return _this;
    }
    return SingleChoiceQuestion;
}(AbstractQuestion));
exports.SingleChoiceQuestion = SingleChoiceQuestion;
var ChoiceQuestionOption = /** @class */ (function () {
    function ChoiceQuestionOption(data) {
        this.value = data.value;
        this.selected = data.selected;
    }
    return ChoiceQuestionOption;
}());
