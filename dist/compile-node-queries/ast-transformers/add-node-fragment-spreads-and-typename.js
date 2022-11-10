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
exports.addNodeFragmentSpreadsAndTypename = void 0;
const GraphQLAST = __importStar(require("../../utils/ast-nodes"));
const ast_predicates_1 = require("../../utils/ast-predicates");
function addNodeFragmentSpreadsAndTypename(nodeFragments) {
    return {
        FragmentDefinition: () => false,
        SelectionSet: node => {
            if (node.selections.some(ast_predicates_1.isFragmentSpread)) {
                return GraphQLAST.selectionSet([
                    GraphQLAST.field(`__typename`),
                    ...withoutTypename(node.selections),
                    ...spreadAll(nodeFragments),
                ]);
            }
            return undefined;
        },
    };
}
exports.addNodeFragmentSpreadsAndTypename = addNodeFragmentSpreadsAndTypename;
function spreadAll(fragments) {
    return fragments.map(fragment => GraphQLAST.fragmentSpread(fragment.name.value));
}
function withoutTypename(selections) {
    return selections.filter(selection => !isTypeNameField(selection));
}
function isTypeNameField(node) {
    return node.kind === "Field" && node.name.value === `__typename`;
}
//# sourceMappingURL=add-node-fragment-spreads-and-typename.js.map