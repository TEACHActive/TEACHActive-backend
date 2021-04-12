"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
var User = /** @class */ (function () {
    function User(data) {
        this.id = data._id || data.id;
        this.dateCreated = data.dateCreated;
        this.name = data.name;
        this.oktaID = data.oktaID;
    }
    return User;
}());
exports.User = User;
