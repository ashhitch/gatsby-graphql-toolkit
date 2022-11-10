"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LimitOffset = void 0;
const constants_1 = require("../../constants");
exports.LimitOffset = {
    name: "LimitOffset",
    expectedVariableNames: [`limit`, `offset`],
    start() {
        return {
            variables: { limit: constants_1.DEFAULT_PAGE_SIZE, offset: 0 },
            hasNextPage: true,
        };
    },
    next(state, page) {
        var _a;
        const limit = (_a = Number(state.variables.limit)) !== null && _a !== void 0 ? _a : constants_1.DEFAULT_PAGE_SIZE;
        const offset = Number(state.variables.offset) + limit;
        return {
            variables: { limit, offset },
            hasNextPage: page.length === limit,
        };
    },
    concat(result, page) {
        return result.concat(page);
    },
    getItems(pageOrResult) {
        return pageOrResult;
    },
};
//# sourceMappingURL=limit-offset.js.map