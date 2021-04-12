"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Session = void 0;
var luxon_1 = require("luxon");
var Session = /** @class */ (function () {
    function Session(data) {
        var _this = this;
        this.toClient = function () {
            return {
                id: _this.id,
                keyword: _this.keyword,
                metadata: _this.metadata,
                name: _this.name,
                performance: _this.performance,
            };
        };
        this.id = data._id || data.id;
        this.keyword = data.keyword;
        this.developer = data.developer;
        this.version = data.version;
        this.timestamp = luxon_1.DateTime.fromISO(data.timestamp);
        this.schemas = data.schemas;
        this.metadata = data.metadata;
        this.name = data.name;
        this.performance = data.performance;
    }
    return Session;
}());
exports.Session = Session;
