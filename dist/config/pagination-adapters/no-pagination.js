"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NoPagination = void 0;
exports.NoPagination = {
    name: "NoPagination",
    expectedVariableNames: [],
    start() {
        return {
            variables: {},
            hasNextPage: true,
        };
    },
    next() {
        return {
            variables: {},
            hasNextPage: false,
        };
    },
    concat(result) {
        return result;
    },
    getItems(pageOrResult) {
        return pageOrResult;
    },
};
//# sourceMappingURL=no-pagination.js.map