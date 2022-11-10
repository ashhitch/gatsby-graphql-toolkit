"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isTypeNameField = exports.isNonEmptyFragment = exports.isFragmentSpread = exports.isField = exports.isOperation = exports.isFragment = exports.isNode = void 0;
const graphql_1 = require("graphql");
function isNode(node) {
    return (typeof node === `object` &&
        node !== null &&
        typeof node[`kind`] === `string`);
}
exports.isNode = isNode;
function isFragment(node) {
    return node.kind === "FragmentDefinition";
}
exports.isFragment = isFragment;
function isOperation(node) {
    return node.kind === "OperationDefinition";
}
exports.isOperation = isOperation;
function isField(node) {
    return node.kind === "Field";
}
exports.isField = isField;
function isFragmentSpread(node) {
    return node.kind === "FragmentSpread";
}
exports.isFragmentSpread = isFragmentSpread;
function isNonEmptyFragment(fragment) {
    if (!isFragment(fragment)) {
        return false;
    }
    let hasFields = false;
    (0, graphql_1.visit)(fragment, {
        Field: () => {
            hasFields = true;
            return graphql_1.BREAK;
        },
    });
    return hasFields;
}
exports.isNonEmptyFragment = isNonEmptyFragment;
function isTypeNameField(selection) {
    return (selection.kind === "Field" &&
        selection.name.value === `__typename` &&
        !selection.alias);
}
exports.isTypeNameField = isTypeNameField;
//# sourceMappingURL=ast-predicates.js.map