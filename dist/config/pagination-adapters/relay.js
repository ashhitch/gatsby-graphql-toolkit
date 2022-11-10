"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RelayForward = void 0;
const constants_1 = require("../../constants");
exports.RelayForward = {
    name: "RelayForward",
    expectedVariableNames: [`first`, `after`],
    start() {
        return {
            variables: { first: constants_1.DEFAULT_PAGE_SIZE, after: undefined },
            hasNextPage: true,
        };
    },
    next(state, page) {
        var _a, _b;
        const tail = page.edges[page.edges.length - 1];
        const first = (_a = Number(state.variables.first)) !== null && _a !== void 0 ? _a : constants_1.DEFAULT_PAGE_SIZE;
        const after = tail === null || tail === void 0 ? void 0 : tail.cursor;
        return {
            variables: { first, after },
            hasNextPage: Boolean(((_b = page === null || page === void 0 ? void 0 : page.pageInfo) === null || _b === void 0 ? void 0 : _b.hasNextPage) && tail),
        };
    },
    concat(acc, page) {
        return {
            ...acc,
            edges: {
                ...acc.edges,
                ...page.edges,
            },
            pageInfo: page.pageInfo,
        };
    },
    getItems(pageOrResult) {
        return pageOrResult.edges.map(edge => (edge ? edge.node : null));
    },
};
//# sourceMappingURL=relay.js.map