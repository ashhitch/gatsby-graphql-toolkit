"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.dedent = exports.printFragment = exports.printQuery = void 0;
const graphql_1 = require("graphql");
const ast_predicates_1 = require("../../utils/ast-predicates");
function printQuery(compiledQueries, remoteTypeName) {
    const query = compiledQueries.get(remoteTypeName);
    if (!query) {
        throw new Error(`Query for ${remoteTypeName} was not compiled`);
    }
    return (0, graphql_1.print)(query).replace(/\n$/, ``);
}
exports.printQuery = printQuery;
function printFragment(document, fragmentName) {
    const fragment = document.definitions.find(definition => (0, ast_predicates_1.isFragment)(definition) && definition.name.value === fragmentName);
    if (!fragment) {
        throw new Error(`Fragment ${fragmentName} was not compiled`);
    }
    return (0, graphql_1.print)(fragment).replace(/\n$/, ``);
}
exports.printFragment = printFragment;
function dedent(gqlStrings) {
    return (0, graphql_1.print)((0, graphql_1.parse)(gqlStrings[0])).replace(/\n$/, ``);
}
exports.dedent = dedent;
//# sourceMappingURL=print.js.map