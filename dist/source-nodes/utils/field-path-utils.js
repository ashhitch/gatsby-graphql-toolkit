"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateFirstValueByPath = exports.getFirstValueByPath = exports.findFieldPath = exports.findNodeFieldPath = exports.findPaginatedFieldPath = void 0;
const graphql_1 = require("graphql");
const GraphQLAST = __importStar(require("../../utils/ast-nodes"));
/**
 * Given a query and an effective pagination adapter - returns field path to the first
 * paginated field
 *
 * E.g.
 *   { field { paginatedField(limit: $limit, offset: $offset) { test } } }
 * or
 *   { field { ...MyFragment }}
 *   fragment MyFragment on MyType {
 *     paginatedField(limit: $limit, offset: $offset) { test }
 *   }
 * both return
 *   ["field", "paginatedField"]
 */
function findPaginatedFieldPath(document, operationName, paginationAdapter) {
    const expectedVars = paginationAdapter.expectedVariableNames;
    if (!expectedVars.length) {
        // FIXME: LIST_ queries without variables do not work for Relay connections:
        //   { myConnection { edges { node { __typename ...IdFragment } } }
        //   We want to return path to `myConnection` here but it will detect `node` field.
        //   So maybe allow pagination adapter to decide? i.e. Relay could look into
        //   type name and return first field with `MyConnection` type
        // TODO: use first fragment spread instead of __typename
        const hasTypeNameField = (field) => field.selectionSet
            ? field.selectionSet.selections.some(s => s.kind === "Field" && s.name.value === `__typename`)
            : false;
        return findFieldPath(document, operationName, hasTypeNameField);
    }
    const isPaginatedField = (node) => {
        var _a;
        const variables = [];
        (_a = node.arguments) === null || _a === void 0 ? void 0 : _a.forEach(arg => {
            (0, graphql_1.visit)(arg, {
                Variable: variableNode => {
                    variables.push(variableNode.name.value);
                },
            });
        });
        return (variables.length > 0 &&
            expectedVars.every(name => variables.includes(name)));
    };
    return findFieldPath(document, operationName, isPaginatedField);
}
exports.findPaginatedFieldPath = findPaginatedFieldPath;
/**
 * Given a query and a remote node type returns a path to the node field within the query
 */
function findNodeFieldPath(document, operationName) {
    // For now simply assuming the first field with a variable
    const hasVariableArgument = (node) => {
        var _a;
        return ((_a = node.arguments) !== null && _a !== void 0 ? _a : []).some(arg => {
            let hasVariable = false;
            (0, graphql_1.visit)(arg, {
                Variable: () => {
                    hasVariable = true;
                    return graphql_1.BREAK;
                },
            });
            return hasVariable;
        });
    };
    return findFieldPath(document, operationName, hasVariableArgument);
}
exports.findNodeFieldPath = findNodeFieldPath;
function findFieldPath(document, operationName, predicate) {
    const operation = document.definitions.find(def => { var _a; return def.kind === "OperationDefinition" && ((_a = def.name) === null || _a === void 0 ? void 0 : _a.value) === operationName; });
    if (!operation) {
        return [];
    }
    const fieldPath = [];
    (0, graphql_1.visit)(operation, {
        Field: {
            enter: (node) => {
                if (fieldPath.length > 10) {
                    throw new Error(`findFieldPath could not find matching field: reached maximum nesting level`);
                }
                fieldPath.push(node.name.value);
                if (predicate(node)) {
                    return graphql_1.BREAK;
                }
            },
            leave: () => {
                fieldPath.pop();
            },
        },
        FragmentSpread: (node) => {
            const fragmentName = node.name.value;
            const fragment = document.definitions.find((f) => f.kind === "FragmentDefinition" && f.name.value === fragmentName);
            if (!fragment) {
                throw new Error(`Missing fragment ${fragmentName}`);
            }
            return GraphQLAST.inlineFragment(fragmentName, fragment.selectionSet.selections);
        },
    });
    return fieldPath;
}
exports.findFieldPath = findFieldPath;
function getFirstValueByPath(item, path) {
    if (path.length === 0) {
        return item;
    }
    if (Array.isArray(item)) {
        return getFirstValueByPath(item[0], path);
    }
    if (typeof item === `object` && item !== null) {
        const [key, ...nestedPath] = path;
        return getFirstValueByPath(item[key], nestedPath);
    }
    return undefined;
}
exports.getFirstValueByPath = getFirstValueByPath;
function updateFirstValueByPath(item, path, newValue) {
    if (path.length === 1 && typeof item === `object` && item !== null) {
        item[path[0]] = newValue;
        return;
    }
    if (Array.isArray(item)) {
        return updateFirstValueByPath(item[0], path, newValue);
    }
    if (typeof item === `object` && item !== null) {
        const [key, ...nestedPath] = path;
        return updateFirstValueByPath(item[key], nestedPath, newValue);
    }
}
exports.updateFirstValueByPath = updateFirstValueByPath;
//# sourceMappingURL=field-path-utils.js.map