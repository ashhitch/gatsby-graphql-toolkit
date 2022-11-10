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
exports.removeUnusedFragments = void 0;
const GraphQLAST = __importStar(require("../../utils/ast-nodes"));
const ast_predicates_1 = require("../../utils/ast-predicates");
function removeUnusedFragments() {
    let currentSpreads = [];
    const definitionSpreads = new Map();
    return {
        FragmentSpread: {
            enter: node => currentSpreads.push(node.name.value),
            leave: () => { },
        },
        // enter: {
        //   FragmentSpread: node => {
        //     currentSpreads.push(node.name.value)
        //   },
        // },
        OperationDefinition: {
            leave: node => {
                var _a;
                const name = (_a = node.name) === null || _a === void 0 ? void 0 : _a.value;
                if (!name) {
                    throw new Error("Every query must have a name");
                }
                definitionSpreads.set(name, currentSpreads);
                currentSpreads = [];
            },
        },
        FragmentDefinition: {
            leave: node => {
                var _a;
                const name = (_a = node.name) === null || _a === void 0 ? void 0 : _a.value;
                definitionSpreads.set(name, currentSpreads);
                currentSpreads = [];
            },
        },
        Document: {
            leave: xnode => {
                const node = xnode;
                const operations = node.definitions.filter(ast_predicates_1.isOperation);
                const operationNames = operations.map(op => { var _a; return (_a = op.name) === null || _a === void 0 ? void 0 : _a.value; });
                const usedSpreads = new Set(operationNames.reduce(collectSpreadsRecursively, []));
                const usedFragments = node.definitions.filter(node => (0, ast_predicates_1.isFragment)(node) && usedSpreads.has(node.name.value));
                return GraphQLAST.document([...operations, ...usedFragments]);
            },
        },
    };
    function collectSpreadsRecursively(acc, definitionName) {
        var _a;
        if (!definitionName) {
            return acc;
        }
        const spreads = (_a = definitionSpreads.get(definitionName)) !== null && _a !== void 0 ? _a : [];
        return spreads.length === 0
            ? acc
            : spreads.reduce(collectSpreadsRecursively, acc.concat(spreads));
    }
}
exports.removeUnusedFragments = removeUnusedFragments;
//# sourceMappingURL=remove-unused-fragments.js.map