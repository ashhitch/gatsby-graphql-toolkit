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
exports.replaceNodeSelectionWithReference = void 0;
const graphql_1 = require("graphql");
const GraphQLAST = __importStar(require("../../utils/ast-nodes"));
const ast_predicates_1 = require("../../utils/ast-predicates");
/**
 * Replaces selection of nodes with references to those nodes.
 *
 * For example (assuming `author` is of type `User` which is a gatsby node):
 * {
 *   author {
 *     firstName
 *     email
 *   }
 * }
 * Is transformed to:
 * {
 *   author {
 *     __typename
 *     id
 *   }
 * }
 */
function replaceNodeSelectionWithReference(args) {
    return {
        Field: node => {
            var _a;
            const type = args.typeInfo.getType();
            if (!type || !((_a = node.selectionSet) === null || _a === void 0 ? void 0 : _a.selections.length)) {
                return;
            }
            const namedType = (0, graphql_1.getNamedType)(type);
            const fragment = args.nodeReferenceFragmentMap.get(namedType.name);
            if (fragment) {
                return { ...node, selectionSet: fragment.selectionSet };
            }
            if ((0, graphql_1.isInterfaceType)(namedType)) {
                return transformInterfaceField(args, node, namedType);
            }
            return;
        },
    };
}
exports.replaceNodeSelectionWithReference = replaceNodeSelectionWithReference;
function transformInterfaceField(args, node, type) {
    const possibleTypes = args.schema.getPossibleTypes(type);
    const nodeImplementations = possibleTypes.some(type => args.nodeReferenceFragmentMap.has(type.name));
    if (!nodeImplementations) {
        return;
    }
    // Replace with inline fragment for each implementation
    const selections = possibleTypes
        .map(type => {
        var _a;
        const nodeReferenceFragment = args.nodeReferenceFragmentMap.get(type.name);
        const inlineFragmentSelections = nodeReferenceFragment
            ? nodeReferenceFragment.selectionSet.selections
            : filterTypeSelections(args, (_a = node.selectionSet) === null || _a === void 0 ? void 0 : _a.selections, type);
        // Filter out __typename field from inline fragments because we add it to the field itself below
        //   (just a prettify thing)
        return GraphQLAST.inlineFragment(type.name, inlineFragmentSelections.filter(selection => !(0, ast_predicates_1.isTypeNameField)(selection)));
    })
        .filter(inlineFragment => inlineFragment.selectionSet.selections.length > 0);
    return {
        ...node,
        selectionSet: {
            kind: graphql_1.Kind.SELECTION_SET,
            selections: [GraphQLAST.field(`__typename`), ...selections],
        },
    };
}
function filterTypeSelections(args, selections = [], type) {
    // @ts-ignore
    return selections.filter(selection => {
        var _a;
        if (selection.kind === `Field`) {
            // Every field selected on interface type already exists
            // on implementing object type
            return true;
        }
        if (selection.kind === `InlineFragment`) {
            const typeName = (_a = selection.typeCondition) === null || _a === void 0 ? void 0 : _a.name.value;
            return !typeName || typeName === type.name;
        }
        if (selection.kind === `FragmentSpread`) {
            const fragmentName = selection.name.value;
            const fragment = args.originalCustomFragments.find(def => def.name.value === fragmentName);
            return fragment && fragment.typeCondition.name.value === type.name;
        }
        return false;
    });
}
//# sourceMappingURL=replace-node-selection-with-reference.js.map