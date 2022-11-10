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
exports.addVariableDefinitions = void 0;
const graphql_1 = require("graphql");
const GraphQLAST = __importStar(require("../../utils/ast-nodes"));
function addVariableDefinitions({ typeInfo, }) {
    const fragmentInfo = new Map();
    const operationInfo = new Map();
    let currentDefinition;
    return {
        Document: {
            leave: node => {
                const result = {
                    ...node,
                    definitions: node.definitions.map(def => def.kind === graphql_1.Kind.OPERATION_DEFINITION
                        ? ensureVariableDefinitions(def, operationInfo, fragmentInfo)
                        : def),
                };
                return result;
            },
        },
        OperationDefinition: {
            enter: () => {
                currentDefinition = {
                    usedFragments: new Set(),
                    variables: new Map(),
                };
            },
            leave: node => {
                var _a, _b;
                operationInfo.set((_b = (_a = node.name) === null || _a === void 0 ? void 0 : _a.value) !== null && _b !== void 0 ? _b : ``, currentDefinition);
            },
        },
        FragmentDefinition: {
            enter: () => {
                currentDefinition = {
                    usedFragments: new Set(),
                    variables: new Map(),
                };
            },
            leave: node => {
                fragmentInfo.set(node.name.value, currentDefinition);
            },
        },
        FragmentSpread: node => {
            currentDefinition.usedFragments.add(node.name.value);
        },
        Variable: node => {
            const inputType = typeInfo.getInputType();
            // FIXME: throw if no inputType found?
            if (inputType) {
                currentDefinition.variables.set(node.name.value, inputType);
            }
        },
    };
}
exports.addVariableDefinitions = addVariableDefinitions;
function ensureVariableDefinitions(node, operationInfo, fragmentsInfo) {
    var _a, _b;
    const name = (_b = (_a = node.name) === null || _a === void 0 ? void 0 : _a.value) !== null && _b !== void 0 ? _b : ``;
    const variables = collectVariables(operationInfo.get(name), fragmentsInfo);
    if (!variables.size) {
        return node;
    }
    const variableDefinitions = [];
    for (const [name, inputType] of variables) {
        variableDefinitions.push({
            kind: graphql_1.Kind.VARIABLE_DEFINITION,
            variable: {
                kind: graphql_1.Kind.VARIABLE,
                name: GraphQLAST.name(name),
            },
            type: (0, graphql_1.parseType)(inputType.toString()),
        });
    }
    return {
        ...node,
        variableDefinitions,
    };
}
function collectVariables(definitionInfo, fragmentsInfo, visited = new Set()) {
    if (!definitionInfo || visited.has(definitionInfo)) {
        return new Map();
    }
    visited.add(definitionInfo);
    const variables = [...definitionInfo.variables];
    for (const fragmentName of definitionInfo.usedFragments) {
        const fragmentVariables = collectVariables(fragmentsInfo.get(fragmentName), fragmentsInfo, visited);
        variables.push(...fragmentVariables);
    }
    return new Map(variables);
}
//# sourceMappingURL=add-variable-definitions.js.map